import { TId } from './shared'

export type TStudent = {
	id: TId
	group_id: TId
	first_name: string
	last_name: string
	email: string
}

export type TStudents = {
	[key: TId]: TStudent
}

export type TStudentsList = TStudent[] | []
