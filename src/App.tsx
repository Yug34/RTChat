import { useEffect, useRef, useState } from 'react'
import {
  createCall,
  listenForAnswer,
  setAnswer,
  addIceCandidate,
  listenForIceCandidates,
} from './utils/signaling'
import { doc, DocumentData, getDoc } from 'firebase/firestore'
import { db } from './utils/firebase'
import { cn } from './lib/utils'
import PermissionsDrawer from './components/PermissionsDrawer'
import CallControls from './components/CallControls'
import { toast } from 'sonner'

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [callId, setCallId] = useState<string>('')
  const [joinId, setJoinId] = useState<string>('')
  const [role, setRole] = useState<'offer' | 'answer' | null>(null)
  const [status, setStatus] = useState<
    'Standby' | 'Joining' | 'Hosting' | 'Connected' | 'Waiting' | 'NotFound'
  >('Standby')
  const [isRemoteStreamActive, setIsRemoteStreamActive] = useState(false)
  const [isPermissionGranted, setIsPermissionGranted] = useState(true)

  const selfVideoRef = useRef<HTMLVideoElement>(null)
  const guestVideoRef = useRef<HTMLVideoElement>(null)

  // ICE listeners cleanup
  const iceUnsubs = useRef<(() => void)[]>([])
  const answerUnsub = useRef<null | (() => void)>(null)

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  const initialize = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })
      selfVideoRef.current!.srcObject = stream
      setLocalStream(stream)
      setIsInitialized(true)
    } catch {
      setIsPermissionGranted(false)
    }
  }

  // OFFERER: Start a call
  const startCall = async () => {
    setRole('offer')
    setStatus('Hosting')
    const pc = new RTCPeerConnection()
    const remote = new MediaStream()
    guestVideoRef.current!.srcObject = remote

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
        await addIceCandidate(callId, event.candidate.toJSON(), 'offer')
      }
    }

    // Listen for answer
    answerUnsub.current = listenForAnswer(newCallId, {
      onAnswer: async (answer) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
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
    setStatus('Joining')
    const pc = new RTCPeerConnection()
    const remote = new MediaStream()
    guestVideoRef.current!.srcObject = remote

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
    setStatus('Connected')

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
    }
  }, [])

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen">
      <PermissionsDrawer isPermissionGranted={isPermissionGranted} />
      <video
        className="absolute top-0 left-0 w-full h-full bg-black opacity-20 -z-10"
        ref={selfVideoRef}
        autoPlay
        playsInline
      />
      <video
        className={cn('absolute top-4 left-4 w-[400px] h-[400px] bg-black', {
          hidden: !isRemoteStreamActive,
        })}
        ref={guestVideoRef}
        autoPlay
        playsInline
      />
      <CallControls
        isInitialized={isInitialized}
        role={role}
        startCall={startCall}
        joinCall={joinCall}
        joinId={joinId}
        setJoinId={setJoinId}
        status={status}
      />
      {callId && (
        <div className="mb-2">
          <span className="font-mono">
            Call ID: <b>{callId}</b>
          </span>
        </div>
      )}
    </main>
  )
}

export default App
