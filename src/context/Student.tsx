import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, set } from 'firebase/database'

import { TStudent, TStudents, TStudentsList } from 'ts/types/student'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		studentsList: TStudentsList
		students: TStudents
	}
	actions: {
		setNewStudent: (student: TStudent) => void
	}
	selectors: {}
}

const db = getDatabase()
const studentsRef = ref(db, 'students')
const Student = createContext<IContext | null>(null)

export function useStudent(): IContext {
	const context = useContext(Student)
	if (!context) {
		throw new Error('useStudent must be used within an StudentProvider')
	}

	return context
}

export function StudentProvider({ children }: IProviderProps): JSX.Element {
	const [students, setStudents] = useState<TStudents>({})

	const studentsList: TStudentsList = Object.values(students)

	useEffect((): void => {
		onValue(studentsRef, (snapshot) => {
			if (snapshot.exists()) {
				const students: TStudents = snapshot.val()
				setStudents(students)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		function setNewStudent(student: TStudent): void {
			set(ref(db, `students/${student.id}`), {
				...student,
			})
		}

		return {
			data: { students, studentsList },
			actions: { setNewStudent },
			selectors: {},
		}
	}, [students, studentsList])
	return <Student.Provider value={value}>{children}</Student.Provider>
}
