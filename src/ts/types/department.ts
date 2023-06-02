import { TId } from './shared'

export type TDepartment = {
	id: TId
	faculty_id: TId
	name: string
	short_name: string
	groups: TId[]
	teachers: TId[]
}

export type TDepartments = {
	[key: TId]: TDepartment
}

export type TDepartmentsList = TDepartment[] | []

export type TDepartmentsFilters = {
	faculies: TId[]
}

export type TUpdateDepartmentListPayload = {
	value: TId[]
	departmentId: TId
	listName: 'teachers' | 'groups'
}
