import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, set } from 'firebase/database'

import { TTeacher, TTeachers, TTeachersList } from 'ts/types/teacher'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		teachersList: TTeachersList
		teachers: TTeachers
	}
	actions: {
		setNewTeacher: (teacher: TTeacher) => void
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

	const teachersList: TTeachersList = Object.values(teachers)

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

		return {
			data: { teachers, teachersList },
			actions: { setNewTeacher },
			selectors: {},
		}
	}, [teachers, teachersList])
	return <Teacher.Provider value={value}>{children}</Teacher.Provider>
}
