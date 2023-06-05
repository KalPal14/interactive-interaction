import { ThenableReference } from 'firebase/database'
import { TId } from './shared'

export type TPredmet = {
	id: TId
	lectures: TId[]
	name: string
}

export type TPredmets = {
	[key: TId]: TPredmet
}

export type TPredmetsList = TPredmet[] | []

export type TNewPredmetPayload = {
	ref: ThenableReference
	lectures: TId[]
	name: string
}

export type TUpdatePredmetListPayload = {
	value: TId[]
	predmetId: TId
	listName: 'lectures'
}
