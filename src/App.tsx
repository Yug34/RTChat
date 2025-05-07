import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const selfVideoRef = useRef<HTMLVideoElement>(null)
  const guestVideoRef = useRef<HTMLVideoElement>(null)

  const [isInitialized, setIsInitialized] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const initialize = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
    selfVideoRef.current!.srcObject = stream
    setLocalStream(stream)

    setIsInitialized(true)
  }

  const createOffer = async () => {
    const peerConnection = new RTCPeerConnection()

    const stream = new MediaStream()
    guestVideoRef.current!.srcObject = stream
    setRemoteStream(stream)

    localStream!.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream!)
    })

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream!.addTrack(track)
      })
    }

    peerConnection.onicecandidate = (event) => {
      console.log(event)
      console.log('New ice candidate: ', event.candidate)
    }

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
  }

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    if (isInitialized) {
      createOffer()
    }
  }, [isInitialized])

  return (
    <>
      <h1 className="text-3xl font-bold underline">RTC Project</h1>
      <div className='flex gap-5'>
        <video 
          className="w-[400px] h-[400px] bg-black"
          ref={selfVideoRef}
          autoPlay
          playsInline
        />
        <video 
          className="w-[400px] h-[400px] bg-black"
          ref={guestVideoRef}
          autoPlay
          playsInline
        />
      </div>
    </>
  )
}

export default App
