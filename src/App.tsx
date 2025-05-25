import { useEffect, useRef, useState } from 'react'
import {
  createCall,
  listenForAnswer,
  setAnswer,
  addIceCandidate,
  listenForIceCandidates
} from './utils/signaling'
import { doc, DocumentData, getDoc } from 'firebase/firestore'
import { db } from './utils/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from './lib/utils'
import PermissionsDrawer from './components/PermissionsDrawer'

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [callId, setCallId] = useState<string>('')
  const [joinId, setJoinId] = useState<string>('')
  const [role, setRole] = useState<'offer' | 'answer' | null>(null)
  const [status, setStatus] = useState<string>('')
  const [isGuestConnected, setIsGuestConnected] = useState(false)
  const [isHost, setIsHost] = useState<boolean | null>(null)
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
        audio: false
      })
      selfVideoRef.current!.srcObject = stream
      setLocalStream(stream)
      setIsInitialized(true)
    } catch (error) {
      setIsPermissionGranted(false)
    }
  }

  // OFFERER: Start a call
  const startCall = async () => {
    setRole('offer')
    setStatus('Creating call...')
    const pc = new RTCPeerConnection()
    const remote = new MediaStream()
    guestVideoRef.current!.srcObject = remote

    // Add local tracks
    localStream!.getTracks().forEach(track => {
      pc.addTrack(track, localStream!)
    })

    // On remote track
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remote.addTrack(track)
      })
      setIsGuestConnected(true)
    }

    // On ICE connection state change
    pc.oniceconnectionstatechange = () => {
      if (
        pc.iceConnectionState === 'disconnected' ||
        pc.iceConnectionState === 'failed' ||
        pc.iceConnectionState === 'closed'
      ) {
        setIsGuestConnected(false)
      }
    }

    // Create offer
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    // Store offer in Firestore
    const { callId: newCallId } = await createCall(offer)
    setCallId(newCallId)
    setStatus('Waiting for answer...')

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
        setStatus('Connected!')
      }
    })

    // Listen for answerer's ICE candidates
    iceUnsubs.current.push(
      listenForIceCandidates(newCallId, 'answer', (candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
      })
    )
    setIsHost(true)
  }

  // ANSWERER: Join a call
  const joinCall = async () => {
    setRole('answer')
    setStatus('Joining call...')
    const pc = new RTCPeerConnection()
    const remote = new MediaStream()
    guestVideoRef.current!.srcObject = remote

    // Add local tracks
    localStream!.getTracks().forEach(track => {
      pc.addTrack(track, localStream!)
    })

    // On remote track
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remote.addTrack(track)
      })
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
      setStatus('Call not found!')
      return
    }
    const data: DocumentData = docSnap.data() as DocumentData
    await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
    // Create answer
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    await setAnswer(joinId, answer)
    setCallId(joinId)
    setStatus('Connected!')

    // Listen for offerer's ICE candidates
    iceUnsubs.current.push(
      listenForIceCandidates(joinId, 'offer', (candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
      })
    )
  }

  useEffect(() => {
    initialize()

    const unsubs = iceUnsubs.current
    return () => {
      unsubs.forEach(unsub => unsub())
      if (answerUnsub.current) answerUnsub.current()
    }
  }, [])

  return (
    <main className='flex flex-col items-center justify-center w-screen h-screen'>
      <PermissionsDrawer isPermissionGranted={isPermissionGranted} />
      <video
        className='absolute top-0 left-0 w-full h-full bg-black opacity-20 -z-10'
        ref={selfVideoRef}
        autoPlay
        playsInline
      />
      <video 
        className={
          cn(
            "absolute top-4 left-4 w-[400px] h-[400px] bg-black", 
            { 'hidden': !isGuestConnected }
          )
        }
        ref={guestVideoRef}
        autoPlay
        playsInline
      />
      <div className='mb-4'>
        <Button
          onClick={startCall}
          disabled={!isInitialized || role === 'answer'}
        >
          Create a call
        </Button>
        <Input
          className='px-2 py-1 mr-2 border'
          placeholder='Enter Call ID to Join'
          value={joinId}
          onChange={e => setJoinId(e.target.value)}
          disabled={role === 'offer'}
        />
        <Button
          className='px-4 py-2 text-white bg-green-500 rounded'
          onClick={joinCall}
          disabled={!isInitialized || !joinId || role === 'offer'}
        >
          Join Call
        </Button>
      </div>
      {callId && (
        <div className='mb-2'>
          <span className='font-mono'>Call ID: <b>{callId}</b></span>
        </div>
      )}
      {status && <div className='mb-2 text-blue-700'>{status}</div>}
      <div>
        {isHost ? (
          <div>
            Guest Connected - todo: replace with green dot: {isGuestConnected ? "Yes" : "No"}
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default App
