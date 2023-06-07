import { ThenableReference } from 'firebase/database'
import { TId } from './shared'

export type TQuestionFieldType = 'text' | 'textarea' | 'select' | 'multiselect'

export type TQuestion = {
	id: TId
	lecture_id: TId
	survey_id: TId
	field_type: TQuestionFieldType
	label?: string
	options?: string[]
	correct_answer?: string
	answers?: TId[]
}

export type TQuestions = {
	[key: TId]: TQuestion
}

export type TQuestionsList = TQuestion[] | []

export type TNewQuestionPayload = {
	ref: ThenableReference
	lecture_id: TId
	survey_id: TId
	field_type: TQuestionFieldType
	label?: string
	options?: string[]
	correct_answer?: TId
	answers?: TId[]
}

export type TUpdateQuestionListPayload = {
	value: TId[]
	questionId: TId
	listName: 'answers'
}
