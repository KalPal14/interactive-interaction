import { User } from 'firebase/auth'
import { TId } from './shared'

export type TFirebaseUser = User | null

export type TActiveSession = {
	isAuthorized: boolean
	user: {
		id: TId
		email: string
	} | null
}

export type TAccess = 'guest' | 'userWithoutAccount' | 'userWithAccount'
