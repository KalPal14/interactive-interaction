import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, push, set, ThenableReference } from 'firebase/database'

import { TSurveys, TNewSurveyPayload } from 'ts/types/survey'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		surveys: TSurveys
	}
	actions: {
		setNewSurvey: (payload: TNewSurveyPayload) => void
		createFutureSurveyRef: () => ThenableReference
	}
	selectors: {}
}

const db = getDatabase()
const surveysRef = ref(db, 'surveys')
const Survey = createContext<IContext | null>(null)

export function useSurvey(): IContext {
	const context = useContext(Survey)
	if (!context) {
		throw new Error('useSurvey must be used within an SurveyProvider')
	}

	return context
}

export function SurveyProvider({ children }: IProviderProps): JSX.Element {
	const [surveys, setSurveys] = useState<TSurveys>({})

	useEffect((): void => {
		onValue(surveysRef, (snapshot) => {
			if (snapshot.exists()) {
				const surveys: TSurveys = snapshot.val()
				setSurveys(surveys)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		//actions
		function createFutureSurveyRef(): ThenableReference {
			const surveysRef = ref(db, 'surveys')
			const newSurveyRef = push(surveysRef)
			return newSurveyRef
		}

		function setNewSurvey(payload: TNewSurveyPayload): void {
			if (!payload.ref.key) return
			const { ref, ...surveyInfo } = payload
			set(ref, {
				id: ref.key,
				...surveyInfo,
			})
		}

		return {
			data: { surveys },
			actions: { setNewSurvey, createFutureSurveyRef },
			selectors: {},
		}
	}, [surveys])
	return <Survey.Provider value={value}>{children}</Survey.Provider>
}
