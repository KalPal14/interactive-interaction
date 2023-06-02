import { TId } from './shared'

export type TSignFD = {
	email: string
	password: string
}

export type TCreateAccountFD = {
	firstName: string
	lastName: string
	faculty: TId
	department: TId
	role: TId
	group: TId
}
