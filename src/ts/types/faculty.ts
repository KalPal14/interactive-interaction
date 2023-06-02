import { TId } from './shared'

export type TFaculty = {
	id: TId
	name: string
	short_name: string
	departments: TId[]
}

export type TFaculties = {
	[key: TId]: TFaculty
}

export type TFacultiesList = TFaculty[] | []
