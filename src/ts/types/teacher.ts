import { TId } from './shared'

export type TTeacher = {
	id: TId
	department_id: TId
	first_name: string
	last_name: string
	email: string
}

export type TTeachers = {
	[key: TId]: TTeacher
}

export type TTeachersList = TTeacher[] | []
