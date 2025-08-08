import { CallStatus } from '@/types'
import { create } from 'zustand'

export type ChatStoreState = {
  isInitialized: boolean
  setIsInitialized: (isInitialized: boolean) => void
  callId: string
  setCallId: (callId: string) => void
  joinId: string
  setJoinId: (joinId: string) => void
  role: 'offer' | 'answer' | null
  setRole: (role: 'offer' | 'answer' | null) => void
  status: CallStatus
  setStatus: (status: CallStatus) => void
  isRemoteStreamActive: boolean
  setIsRemoteStreamActive: (isRemoteStreamActive: boolean) => void
  isPermissionGranted: boolean
  setIsPermissionGranted: (isPermissionGranted: boolean) => void
  isMicOn: boolean
  setIsMicOn: (isMicOn: boolean) => void
  isCameraOn: boolean
  setIsCameraOn: (isCameraOn: boolean) => void
  localStream: MediaStream | null
  setLocalStream: (localStream: MediaStream | null) => void
}

const useChatStore = create<ChatStoreState>((set) => ({
  isInitialized: false,
  setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
  callId: '',
  setCallId: (callId: string) => set({ callId }),
  joinId: '',
  setJoinId: (joinId: string) => set({ joinId }),
  role: null,
  setRole: (role: 'offer' | 'answer' | null) => set({ role }),
  status: 'Standby',
  setStatus: (status: CallStatus) => set({ status }),
  isRemoteStreamActive: false,
  setIsRemoteStreamActive: (isRemoteStreamActive: boolean) => set({ isRemoteStreamActive }),
  isPermissionGranted: true,
  setIsPermissionGranted: (isPermissionGranted: boolean) => set({ isPermissionGranted }),
  isMicOn: true,
  setIsMicOn: (isMicOn: boolean) => set({ isMicOn }),
  isCameraOn: true,
  setIsCameraOn: (isCameraOn: boolean) => set({ isCameraOn }),
  localStream: null,
  setLocalStream: (localStream: MediaStream | null) => set({ localStream }),
}))

export default useChatStore
