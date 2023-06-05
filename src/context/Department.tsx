import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, set } from 'firebase/database'

import {
	TDepartments,
	TDepartmentsFilters,
	TDepartmentsList,
	TUpdateDepartmentListPayload,
} from 'ts/types/department'
import { TSelectOptionsList } from 'ts/types/inputFields'
import { defDepartmentsFilters } from 'helpers/defaultValues'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		departmentsList: TDepartmentsList
		departments: TDepartments
	}
	actions: {
		updateDepartmentListField: (payload: TUpdateDepartmentListPayload) => void
	}
	selectors: {
		selectDepartmentsListBy: (filters: TDepartmentsFilters) => TDepartmentsList
		selectDepartmentsOptionsBy: (filters: TDepartmentsFilters) => TSelectOptionsList
	}
}

const db = getDatabase()
const departmentsRef = ref(db, 'departments')
const Department = createContext<IContext | null>(null)

export function useDepartment(): IContext {
	const context = useContext(Department)
	if (!context) {
		throw new Error('useDepartment must be used within an DepartmentProvider')
	}

	return context
}

export function DepartmentProvider({ children }: IProviderProps): JSX.Element {
	const [departments, setDepartments] = useState<TDepartments>({})

	const departmentsList: TDepartmentsList = Object.values(departments)

	useEffect((): void => {
		onValue(departmentsRef, (snapshot) => {
			if (snapshot.exists()) {
				const departments: TDepartments = snapshot.val()
				setDepartments(departments)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		//actions
		function updateDepartmentListField({
			value,
			departmentId,
			listName,
		}: TUpdateDepartmentListPayload): void {
			const prevList = departments[departmentId][listName] ?? []
			const onlyNewItems = value.filter((item) => !prevList.includes(item))
			if (!onlyNewItems.length) return
			const newList = [...prevList, ...onlyNewItems]
			set(ref(db, `departments/${departmentId}/${listName}`), newList)
		}
		//selectors
		function selectDepartmentsListBy({
			faculies = [],
		}: TDepartmentsFilters = defDepartmentsFilters): TDepartmentsList {
			return departmentsList.filter((department) => faculies.includes(department.faculty_id))
		}

		function selectDepartmentsOptionsBy({
			faculies = [],
		}: TDepartmentsFilters = defDepartmentsFilters): TSelectOptionsList {
			const sortedDepartmentsList = selectDepartmentsListBy({ faculies })
			return sortedDepartmentsList.map((department) => ({
				key: department.id,
				value: department.id,
				text: department.name,
			}))
		}

		return {
			data: { departments, departmentsList },
			actions: { updateDepartmentListField },
			selectors: { selectDepartmentsListBy, selectDepartmentsOptionsBy },
		}
	}, [departments, departmentsList])
	return <Department.Provider value={value}>{children}</Department.Provider>
}
