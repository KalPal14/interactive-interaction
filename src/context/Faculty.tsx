import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue } from 'firebase/database'

import { TFaculties, TFacultiesList } from 'ts/types/faculty'
import { TSelectOptionsList } from 'ts/types/inputFields'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		facultiesList: TFacultiesList
		faculties: TFaculties
		facultiesOptions: TSelectOptionsList
	}
	actions: {}
}

const db = getDatabase()
const facultiesRef = ref(db, 'faculties')
const Faculty = createContext<IContext | null>(null)

export function useFaculty(): IContext {
	const context = useContext(Faculty)
	if (!context) {
		throw new Error('useFaculty must be used within an FacultyProvider')
	}

	return context
}

export function FacultyProvider({ children }: IProviderProps): JSX.Element {
	const [faculties, setFaculties] = useState<TFaculties>({})

	const facultiesList: TFacultiesList = Object.values(faculties)
	const facultiesOptions: TSelectOptionsList = facultiesList.map((faculty) => ({
		key: faculty.id,
		value: faculty.id,
		text: faculty.name,
	}))

	useEffect((): void => {
		onValue(facultiesRef, (snapshot) => {
			if (snapshot.exists()) {
				const faculties: TFaculties = snapshot.val()
				setFaculties(faculties)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		return {
			data: { faculties, facultiesList, facultiesOptions },
			actions: {},
		}
	}, [faculties, facultiesList, facultiesOptions])
	return <Faculty.Provider value={value}>{children}</Faculty.Provider>
}
