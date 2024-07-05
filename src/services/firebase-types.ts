export type MovementRMRequest = { movement: string, kgs: string }
export type NewWeightRequest = { kgs: string }

type FirebaseTimestamp = { seconds: number, nanoseconds: number }
export type MovementFirebaseResponse = { name: string, rms: MovementRMFirebaseResponse[] }
export type MovementRMFirebaseResponse = { kgs: string; date: FirebaseTimestamp }
export type WeightFirebaseResponse = { weight: string, date: FirebaseTimestamp }

export type MovementRMWithDateString = { kgs: string; date: string; }
export type AllRMs = Record<string, MovementRMWithDateString[]>
export type WeightWithDateString = { weight: string, date: string }