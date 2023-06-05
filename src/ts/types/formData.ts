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
	role: 'student' | 'teacher'
	group: TId
}

export type TCreateLectureFD = {
	name: string
	predmet: TId
	newPredmet: string
	startDate: string
	endDate: string
	groups: TId[]
}
