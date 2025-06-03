type CallStatus =
  | 'Standby' // Answer, Offer - Nothing really going on
  | 'Joining' // Answer - waiting for user to finish joining
  | 'Hosting' // Offer - creating a new call
  | 'Connected' // Answer, Offer - everything OK!
  | 'Waiting' // Offer - user is waiting for the call to start
  | 'NotFound' // Answer - call not found
//   | 'Disconnected' // Answer, Offer - user disconnected

type Role = 'offer' | 'answer'

export type { CallStatus, Role }
