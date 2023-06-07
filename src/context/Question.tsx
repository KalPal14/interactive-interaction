import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, push, set, ThenableReference } from 'firebase/database'

import { TQuestions, TNewQuestionPayload } from 'ts/types/question'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		questions: TQuestions
	}
	actions: {
		setNewQuestion: (payload: TNewQuestionPayload) => void
		createFutureQuestionRef: () => ThenableReference
	}
	selectors: {}
}

const db = getDatabase()
const questionsRef = ref(db, 'questions')
const Question = createContext<IContext | null>(null)

export function useQuestion(): IContext {
	const context = useContext(Question)
	if (!context) {
		throw new Error('useQuestion must be used within an QuestionProvider')
	}

	return context
}

export function QuestionProvider({ children }: IProviderProps): JSX.Element {
	const [questions, setQuestions] = useState<TQuestions>({})

	useEffect((): void => {
		onValue(questionsRef, (snapshot) => {
			if (snapshot.exists()) {
				const questions: TQuestions = snapshot.val()
				setQuestions(questions)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		//actions
		function createFutureQuestionRef(): ThenableReference {
			const questionsRef = ref(db, 'questions')
			const newQuestionRef = push(questionsRef)
			return newQuestionRef
		}

		function setNewQuestion(payload: TNewQuestionPayload): void {
			if (!payload.ref.key) return
			const { ref, ...questionInfo } = payload
			set(ref, {
				id: ref.key,
				...questionInfo,
			})
		}

		return {
			data: { questions },
			actions: { setNewQuestion, createFutureQuestionRef },
			selectors: {},
		}
	}, [questions])
	return <Question.Provider value={value}>{children}</Question.Provider>
}
