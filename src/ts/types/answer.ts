import { ThenableReference } from 'firebase/database'
import { TId } from './shared'

export type TAnswer = {
	id: TId
	user_id: TId
	question_id: TId
	answer: string
}

export type TAnswers = {
	[key: TId]: TAnswer
}

export type TAnswersList = TAnswer[] | []

export type TNewAnswerPayload = {
	ref: ThenableReference
	user_id: TId
	question_id: TId
	answer: string
}
