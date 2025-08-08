import { useEffect, useRef } from 'react'
import {
  createCall,
  listenForAnswer,
  setAnswer,
  addIceCandidate,
  listenForIceCandidates,
} from './utils/signaling'
import { doc, DocumentData, getDoc } from 'firebase/firestore'
import { db } from './utils/firebase'
import PermissionsDrawer from './components/PermissionsDrawer'
import { toast } from 'sonner'
import CallControls from './components/CallControls'
import useChatStore from './store/core'
import RemoteVideo from './components/RemoteVideo'
import Navbar from './components/Navbar'
import VideoPreview from './components/VideoPreview'
import SelfVideo from './components/SelfVideo'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import DroppableZones from './components/DroppableZones'
import useDragDropStore from './store/dragDropStore'
import { DEFAULT_ACTIVE_PARENT } from '@/constants'
import { cleanupCall, listenForCallTermination } from './utils/signaling'

const App = () => {
  const {
    status,
    isCameraOn,
    setIsInitialized,
    callId,
    setCallId,
    joinId,
    setRole,
    setStatus,
    setIsRemoteStreamActive,
    setIsPermissionGranted,
    setLocalStream,
    localStream,
    role,
  } = useChatStore()

  // Store the role when call is established to avoid issues with role being cleared
  const establishedRoleRef = useRef<'offer' | 'answer' | null>(null)

  const { setActiveParent } = useDragDropStore()

  const previewVideoRef = useRef<HTMLVideoElement>(null)
  const selfVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Listeners cleanup
  const iceUnsubs = useRef<(() => void)[]>([])
  const answerUnsub = useRef<null | (() => void)>(null)
  const callDocUnsub = useRef<null | (() => void)>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)

  const endCall = async (
    opts: { shouldDelete?: boolean; reason?: 'remote-left' | 'local-left' } = {},
  ) => {
    const { shouldDelete = false, reason } = opts

    // Unsubscribe snapshots
    iceUnsubs.current.forEach((unsub) => unsub())
    iceUnsubs.current = []
    if (answerUnsub.current) {
      answerUnsub.current()
      answerUnsub.current = null
    }
    if (callDocUnsub.current) {
      callDocUnsub.current()
      callDocUnsub.current = null
    }

    try {
      pcRef.current?.close()
    } catch (e) {
      console.warn('Error closing peer connection', e)
    }
    pcRef.current = null

    try {
      if (shouldDelete && callId) {
        await cleanupCall(callId)
      }
    } catch (e) {
      console.warn('Error cleaning up call', e)
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    if (reason === 'remote-left') {
      const currentRole = establishedRoleRef.current
      const remoteName = currentRole === 'offer' ? 'guest' : 'host'
      toast.info(`The ${remoteName} has disconnected.`)
    }

    clearState()
  }

  const clearState = () => {
    console.log('clearState called, current role before clearing:', role)
    setIsRemoteStreamActive(false)
    setStatus('Standby')
    setCallId('')
    setRole(null)
    establishedRoleRef.current = null
  }

  const initialize = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })
      previewVideoRef.current!.srcObject = stream
      selfVideoRef.current!.srcObject = stream
      setLocalStream(stream)
      setIsInitialized(true)
    } catch (error) {
      console.log(error)
      setIsPermissionGranted(false)
    }
  }

  // OFFERER: Start a call
  const startCall = async () => {
    setRole('offer')
    establishedRoleRef.current = 'offer'
    setStatus('Hosting')
    const pc = new RTCPeerConnection()
    pcRef.current = pc
    const remote = new MediaStream()
    remoteVideoRef.current!.srcObject = remote

    // Add local tracks
    localStream!.getTracks().forEach((track) => {
      pc.addTrack(track, localStream!)
    })

    // On remote track
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remote.addTrack(track)
      })
      setIsRemoteStreamActive(true)
    }

    // On ICE connection state change
    pc.oniceconnectionstatechange = () => {
      if (['disconnected', 'failed', 'closed'].includes(pc.iceConnectionState)) {
        setIsRemoteStreamActive(false)
      }
    }

    // Create offer
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    // Store offer in Firestore
    const { callId: newCallId } = await createCall(offer)
    setCallId(newCallId)
    toast.success('Call created! Share the Call ID with your friend.')
    setStatus('Waiting')

    // On ICE candidate
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await addIceCandidate(newCallId, event.candidate.toJSON(), 'offer')
      }
    }

    // Listen for call termination (remote leaves)
    callDocUnsub.current = listenForCallTermination(newCallId, () => {
      endCall({ shouldDelete: false, reason: 'remote-left' })
    })

    // Listen for answer
    answerUnsub.current = listenForAnswer(newCallId, {
      onAnswer: async (answer) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
        toast.success('A guest has joined the call!')
        setStatus('Connected')
      },
    })

    // Listen for answerer's ICE candidates
    iceUnsubs.current.push(
      listenForIceCandidates(newCallId, 'answer', (candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
      }),
    )
  }

  // ANSWERER: Join a call
  const joinCall = async () => {
    setRole('answer')
    establishedRoleRef.current = 'answer'
    setStatus('Joining')
    const pc = new RTCPeerConnection()
    pcRef.current = pc
    const remote = new MediaStream()
    remoteVideoRef.current!.srcObject = remote

    // Add local tracks
    localStream!.getTracks().forEach((track) => {
      pc.addTrack(track, localStream!)
    })

    // On remote track
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remote.addTrack(track)
      })
      setIsRemoteStreamActive(true)
    }

    // On ICE candidate
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await addIceCandidate(joinId, event.candidate.toJSON(), 'answer')
      }
    }

    // Fetch offer from Firestore
    const docRef = doc(db, 'calls', joinId)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      setStatus('NotFound')
      toast.error('Call not found! Please check the call ID.')
      setRole(null)
      return
    }
    const data: DocumentData = docSnap.data() as DocumentData
    await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
    // Create answer
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    await setAnswer(joinId, answer)
    setCallId(joinId)
    toast.success('You have joined the call!')
    setStatus('Connected')

    // Listen for call termination (remote leaves)
    callDocUnsub.current = listenForCallTermination(joinId, () => {
      endCall({ shouldDelete: false, reason: 'remote-left' })
    })

    // Listen for offerer's ICE candidates
    iceUnsubs.current.push(
      listenForIceCandidates(joinId, 'offer', (candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
      }),
    )
  }

  useEffect(() => {
    initialize()

    const unsubs = iceUnsubs.current
    return () => {
      unsubs.forEach((unsub) => unsub())
      if (answerUnsub.current) answerUnsub.current()
      if (callDocUnsub.current) callDocUnsub.current()
      // Ensure cleanup on unmount
      if (pcRef.current) {
        endCall({ shouldDelete: true })
      }
    }
  }, [])

  useEffect(() => {
    if (isCameraOn) {
      if (status !== 'Connected') {
        previewVideoRef.current!.srcObject = localStream!
      }
    }
  }, [isCameraOn, localStream, status])

  const draggable = <SelfVideo selfVideoRef={selfVideoRef} />

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveParent(event.over ? (event.over.id as string) : DEFAULT_ACTIVE_PARENT)
  }

  const handleLeave = () => {
    endCall({ shouldDelete: true, reason: 'local-left' })
  }

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
      <main className="flex flex-col items-center justify-center w-screen h-screen max-h-screen max-w-screen overflow-hidden">
        <Navbar />
        <VideoPreview previewVideoRef={previewVideoRef} startCall={startCall} joinCall={joinCall} />
        <RemoteVideo remoteVideoRef={remoteVideoRef} />
        <CallControls onLeave={handleLeave} />
        <PermissionsDrawer />
        <DroppableZones draggable={draggable} />
      </main>
    </DndContext>
  )
}

export default App
