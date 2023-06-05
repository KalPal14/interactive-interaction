import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, push, set, ThenableReference } from 'firebase/database'

import { TLectures, TNewLecturePayload } from 'ts/types/lecture'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		lectures: TLectures
	}
	actions: {
		setNewLecture: (payload: TNewLecturePayload) => void
		createFutureLectureRef: () => ThenableReference
	}
	selectors: {}
}

const db = getDatabase()
const lecturesRef = ref(db, 'lectures')
const Lecture = createContext<IContext | null>(null)

export function useLecture(): IContext {
	const context = useContext(Lecture)
	if (!context) {
		throw new Error('useLecture must be used within an LectureProvider')
	}

	return context
}

export function LectureProvider({ children }: IProviderProps): JSX.Element {
	const [lectures, setLectures] = useState<TLectures>({})

	useEffect((): void => {
		onValue(lecturesRef, (snapshot) => {
			if (snapshot.exists()) {
				const lectures: TLectures = snapshot.val()
				setLectures(lectures)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		//actions
		function createFutureLectureRef(): ThenableReference {
			const lecturesRef = ref(db, 'lectures')
			const newLectureRef = push(lecturesRef)
			return newLectureRef
		}

		function setNewLecture(payload: TNewLecturePayload): void {
			if (!payload.ref.key) return
			const { ref, ...lectureInfo } = payload
			set(ref, {
				id: ref.key,
				...lectureInfo,
			})
		}

		return {
			data: { lectures },
			actions: { setNewLecture, createFutureLectureRef },
			selectors: {},
		}
	}, [lectures])
	return <Lecture.Provider value={value}>{children}</Lecture.Provider>
}
