import { ThenableReference } from 'firebase/database'
import { TId } from './shared'

export type TSurvey = {
	id: TId
	lecture_id: TId
	created_at: string
	is_test: boolean
	name: string
	questions: TId[]
}

export type TSurveys = {
	[key: TId]: TSurvey
}

export type TSurveysList = TSurvey[] | []

export type TNewSurveyPayload = {
	ref: ThenableReference
	lecture_id: TId
	created_at: string
	is_test: boolean
	name: string
	questions: TId[]
}
