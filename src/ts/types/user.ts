import { User } from 'firebase/auth'

import { TId } from './shared'
import { TStudent } from './student'
import { TTeacher } from './teacher'

export type TFirebaseUser = User | null

export type TBasicAuthUserInfo = {
	id: TId
	email: string
	role: 'authorized'
}

export type TUser = TTeacher | TStudent | TBasicAuthUserInfo | null

export type TUsers = {
	[key: TId]: TUser
}

export type TUsersList = TUser[] | []
