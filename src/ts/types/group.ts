import { TId } from './shared'

export type TGroup = {
	id: TId
	department_id: TId
	name: string
	students: TId[]
}

export type TGroups = {
	[key: TId]: TGroup
}

export type TGroupsList = TGroup[] | []

export type TGroupsFilters = {
	departments: TId[]
}

export type TUpdateGroupListPayload = {
	value: TId[]
	groupId: TId
	listName: 'students'
}
