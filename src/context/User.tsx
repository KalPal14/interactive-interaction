import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { useStudent } from './Student'
import { useTeacher } from './Teacher'

import { TUser, TUsers, TFirebaseUser } from 'ts/types/user'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		currentUser: TUser
		users: TUsers
	}
	actions: {}
	selectors: {}
}

const User = createContext<IContext | null>(null)

// create custom hook to check whether we're inside provider
export function useUser(): IContext {
	const context = useContext(User)

	if (!context) {
		throw new Error('useUser must be used within an UserProvider')
	}

	return context
}

export const UserProvider = ({ children }: IProviderProps): JSX.Element => {
	const {
		data: { teachers },
	} = useTeacher()
	const {
		data: { students },
	} = useStudent()

	const [basicUserInfo, setBasicUserInfo] = useState<TUser>(null)
	const [users, setUsers] = useState<TUsers>({})
	const [currentUser, setCurrentUser] = useState<TUser>(null)

	useEffect(() => {
		const auth = getAuth()
		onAuthStateChanged(auth, async (user: TFirebaseUser) => {
			if (user) {
				setBasicUserInfo({
					id: user.uid,
					email: user.email!,
					role: 'authorized',
				})
			} else {
				setBasicUserInfo(null)
			}
		})
	}, [])
	useEffect((): void => {
		const users = { ...teachers, ...students }
		calculateCurrentUser(users)
		setUsers(users)
	}, [teachers, students, basicUserInfo])

	function calculateCurrentUser(users: TUsers): void {
		if (!basicUserInfo) {
			setCurrentUser(null)
			return
		}
		const user = users[basicUserInfo.id]
		user ? setCurrentUser(user) : setCurrentUser(basicUserInfo)
	}

	const value: IContext = useMemo(() => {
		return {
			data: { currentUser, users },
			actions: {},
			selectors: {},
		}
	}, [currentUser, users])
	return <User.Provider value={value}>{children}</User.Provider>
}
