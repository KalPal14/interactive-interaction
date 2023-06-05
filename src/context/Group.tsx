import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDatabase, ref, onValue, set } from 'firebase/database'

import { TGroups, TGroupsFilters, TGroupsList, TUpdateGroupListPayload } from 'ts/types/group'
import { TSelectOptionsList } from 'ts/types/inputFields'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		groupsList: TGroupsList
		groups: TGroups
	}
	actions: {
		updateGroupListField: (payload: TUpdateGroupListPayload) => void
	}
	selectors: {
		selectGroupsListBy: (filters: TGroupsFilters) => TGroupsList
		selectGroupsOptionsBy: (filters: TGroupsFilters) => TSelectOptionsList
		selectAllGroupsOptions: () => TSelectOptionsList
	}
}

const db = getDatabase()
const groupsRef = ref(db, 'groups')
const Group = createContext<IContext | null>(null)

export function useGroup(): IContext {
	const context = useContext(Group)
	if (!context) {
		throw new Error('useGroup must be used within an GroupProvider')
	}

	return context
}

export function GroupProvider({ children }: IProviderProps): JSX.Element {
	const [groups, setGroups] = useState<TGroups>({})

	const groupsList: TGroupsList = Object.values(groups)

	useEffect((): void => {
		onValue(groupsRef, (snapshot) => {
			if (snapshot.exists()) {
				const groups: TGroups = snapshot.val()
				setGroups(groups)
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		//actions
		function updateGroupListField({ value, groupId, listName }: TUpdateGroupListPayload): void {
			const prevList = groups[groupId][listName] ?? []
			const onlyNewItems = value.filter((item) => !prevList.includes(item))
			if (!onlyNewItems.length) return
			const newList = [...prevList, ...onlyNewItems]
			set(ref(db, `groups/${groupId}/${listName}`), newList)
		}
		//selectors
		function selectGroupsListBy({ departments = [] }: TGroupsFilters): TGroupsList {
			return groupsList.filter((group) => departments.includes(group.department_id))
		}

		function selectGroupsOptionsBy({ departments = [] }: TGroupsFilters): TSelectOptionsList {
			const sortedGroupsList = selectGroupsListBy({ departments })
			return sortedGroupsList.map(({ id, name }) => ({
				key: id,
				value: id,
				text: name,
			}))
		}

		function selectAllGroupsOptions(): TSelectOptionsList {
			return groupsList.map(({ id, name }) => ({
				key: id,
				value: id,
				text: name,
			}))
		}

		return {
			data: { groups, groupsList },
			actions: { updateGroupListField },
			selectors: { selectGroupsListBy, selectGroupsOptionsBy, selectAllGroupsOptions },
		}
	}, [groups, groupsList])
	return <Group.Provider value={value}>{children}</Group.Provider>
}
