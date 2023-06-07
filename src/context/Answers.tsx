import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, push, set, ThenableReference } from 'firebase/database'

import { TAnswers, TNewAnswerPayload } from 'ts/types/answer'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		answers: TAnswers
	}
	actions: {
		setNewAnswer: (payload: TNewAnswerPayload) => void
		createFutureAnswerRef: () => ThenableReference
	}
	selectors: {}
}

const db = getDatabase()
const answersRef = ref(db, 'answers')
const Answer = createContext<IContext | null>(null)

export function useAnswer(): IContext {
	const context = useContext(Answer)
	if (!context) {
		throw new Error('useAnswer must be used within an AnswerProvider')
	}

	return context
}

export function AnswerProvider({ children }: IProviderProps): JSX.Element {
	const [answers, setAnswers] = useState<TAnswers>({})

	useEffect((): void => {
		onValue(answersRef, (snapshot) => {
			if (snapshot.exists()) {
				const answers: TAnswers = snapshot.val()
				setAnswers(answers)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		//actions
		function createFutureAnswerRef(): ThenableReference {
			const answersRef = ref(db, 'answers')
			const newAnswerRef = push(answersRef)
			return newAnswerRef
		}

		function setNewAnswer(payload: TNewAnswerPayload): void {
			if (!payload.ref.key) return
			const { ref, ...answerInfo } = payload
			set(ref, {
				id: ref.key,
				...answerInfo,
			})
		}

		return {
			data: { answers },
			actions: { setNewAnswer, createFutureAnswerRef },
			selectors: {},
		}
	}, [answers])
	return <Answer.Provider value={value}>{children}</Answer.Provider>
}
