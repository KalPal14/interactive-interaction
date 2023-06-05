import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, set } from 'firebase/database'

import { TTeacher, TTeachers, TUpdateTeacherListPayload } from 'ts/types/teacher'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		teachers: TTeachers
	}
	actions: {
		setNewTeacher: (teacher: TTeacher) => void
		updateTeacherListField: (payload: TUpdateTeacherListPayload) => void
	}
	selectors: {}
}

const db = getDatabase()
const teachersRef = ref(db, 'teachers')
const Teacher = createContext<IContext | null>(null)

export function useTeacher(): IContext {
	const context = useContext(Teacher)
	if (!context) {
		throw new Error('useTeacher must be used within an TeacherProvider')
	}

	return context
}

export function TeacherProvider({ children }: IProviderProps): JSX.Element {
	const [teachers, setTeachers] = useState<TTeachers>({})

	useEffect((): void => {
		onValue(teachersRef, (snapshot) => {
			if (snapshot.exists()) {
				const teachers: TTeachers = snapshot.val()
				setTeachers(teachers)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		function setNewTeacher(teacher: TTeacher): void {
			set(ref(db, `teachers/${teacher.id}`), {
				...teacher,
			})
		}

		function updateTeacherListField(payload: TUpdateTeacherListPayload): void {
			const { value, teacherId, listName } = payload
			const prevList = teachers[teacherId][listName] ?? []
			const onlyNewItems = value.filter((item) => !prevList.includes(item))
			if (!onlyNewItems.length) return
			const newList = [...prevList, ...onlyNewItems]
			set(ref(db, `teachers/${teacherId}/${listName}`), newList)
		}

		return {
			data: { teachers },
			actions: { setNewTeacher, updateTeacherListField },
			selectors: {},
		}
	}, [teachers])
	return <Teacher.Provider value={value}>{children}</Teacher.Provider>
}
