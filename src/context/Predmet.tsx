import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, push, set, ThenableReference } from 'firebase/database'

import {
	TNewPredmetPayload,
	TPredmets,
	TPredmetsList,
	TUpdatePredmetListPayload,
} from 'ts/types/predmet'
import { TSelectOptionsList } from 'ts/types/inputFields'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		predmets: TPredmets
	}
	actions: {
		setNewPredmet: (payload: TNewPredmetPayload) => void
		updatePredmetListField: (payload: TUpdatePredmetListPayload) => void
		createFuturePredmetRef: () => ThenableReference
	}
	selectors: {
		selectAllPredmetsOptions: () => TSelectOptionsList
	}
}

const db = getDatabase()
const predmetsRef = ref(db, 'predmets')
const Predmet = createContext<IContext | null>(null)

export function usePredmet(): IContext {
	const context = useContext(Predmet)
	if (!context) {
		throw new Error('usePredmet must be used within an PredmetProvider')
	}

	return context
}

export function PredmetProvider({ children }: IProviderProps): JSX.Element {
	const [predmets, setPredmets] = useState<TPredmets>({})

	const predmetsList: TPredmetsList = Object.values(predmets)

	useEffect((): void => {
		onValue(predmetsRef, (snapshot) => {
			if (snapshot.exists()) {
				const predmets: TPredmets = snapshot.val()
				setPredmets(predmets)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		//actions
		function createFuturePredmetRef(): ThenableReference {
			const predmetsRef = ref(db, 'predmets')
			const newPredmetRef = push(predmetsRef)
			return newPredmetRef
		}

		function setNewPredmet(payload: TNewPredmetPayload): void {
			if (!payload.ref.key) return
			const { ref, ...predmetInfo } = payload
			set(ref, {
				id: ref.key,
				...predmetInfo,
			})
		}

		function updatePredmetListField(payload: TUpdatePredmetListPayload): void {
			const { value, predmetId, listName } = payload
			const prevList = predmets[predmetId][listName] ?? []
			const onlyNewItems = value.filter((item) => !prevList.includes(item))
			if (!onlyNewItems.length) return
			const newList = [...prevList, ...onlyNewItems]
			set(ref(db, `predmets/${predmetId}/${listName}`), newList)
		}
		//selectore
		function selectAllPredmetsOptions(): TSelectOptionsList {
			return predmetsList.map(({ id, name }) => ({
				key: id,
				value: id,
				text: name,
			}))
		}

		return {
			data: { predmets },
			actions: { setNewPredmet, updatePredmetListField, createFuturePredmetRef },
			selectors: { selectAllPredmetsOptions },
		}
	}, [predmets, predmetsList])
	return <Predmet.Provider value={value}>{children}</Predmet.Provider>
}
