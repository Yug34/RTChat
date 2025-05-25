import { db } from './firebase'
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'

// Collection for calls
type Candidate = RTCIceCandidateInit

type Callbacks = {
  onAnswer?: (answer: RTCSessionDescriptionInit) => void
  onCandidate?: (candidate: Candidate) => void
}

export const createCall = async (offer: RTCSessionDescriptionInit) => {
  // Create a new call document
  const callDoc = await addDoc(collection(db, 'calls'), { offer })
  const candidatesCollection = collection(callDoc, 'candidates')
  return { callId: callDoc.id, candidatesCollection, callDoc }
}

export const listenForAnswer = (callId: string, { onAnswer }: Callbacks) => {
  const callRef = doc(db, 'calls', callId)
  return onSnapshot(callRef, (snapshot) => {
    const data = snapshot.data()
    if (data?.answer && onAnswer) {
      onAnswer(data.answer)
    }
  })
}

export const setAnswer = async (callId: string, answer: RTCSessionDescriptionInit) => {
  const callRef = doc(db, 'calls', callId)
  await updateDoc(callRef, { answer })
}

export const addIceCandidate = async (callId: string, candidate: Candidate, role: 'offer' | 'answer') => {
  const candidatesRef = collection(db, 'calls', callId, `${role}Candidates`)
  await addDoc(candidatesRef, candidate)
}

export const listenForIceCandidates = (callId: string, role: 'offer' | 'answer', cb: (candidate: Candidate) => void) => {
  const candidatesRef = collection(db, 'calls', callId, `${role}Candidates`)
  return onSnapshot(candidatesRef, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        cb(change.doc.data() as Candidate)
      }
    })
  })
}

export const cleanupCall = async (callId: string) => {
  const callRef = doc(db, 'calls', callId)
  await deleteDoc(callRef)
} 