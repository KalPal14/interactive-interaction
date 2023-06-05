import { ThenableReference } from 'firebase/database'
import { TId } from './shared'

export type TLecture = {
	id: TId
	predmet_id: TId
	teacher_id: TId
	start_date: string
	end_date: string
	name: string
	groups: TId[]
	open_questions?: TId[]
	surveis?: TId[]
}

export type TLectures = {
	[key: TId]: TLecture
}

export type TLecturesList = TLecture[] | []

export type TNewLecturePayload = {
	ref: ThenableReference
	predmet_id: TId
	teacher_id: TId
	start_date: string
	end_date: string
	name: string
	groups: TId[]
	open_questions?: TId[]
	surveis?: TId[]
}
