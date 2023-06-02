import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import { TActiveSession, TFirebaseUser } from 'ts/types/auth'

interface IProviderProps {
	children: JSX.Element
}
interface IContext {
	data: {
		activeSession: TActiveSession
	}
	actions: {}
	selectors: {}
}

const Auth = createContext<IContext | null>(null)

// create custom hook to check whether we're inside provider
export function useAuth(): IContext {
	const context = useContext(Auth)

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}

	return context
}

export const AuthProvider = ({ children }: IProviderProps): JSX.Element => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [activeSession, setActiveSession] = useState<TActiveSession>({
		isAuthorized: false,
		user: null,
	})

	useLayoutEffect(() => {
		const auth = getAuth()
		onAuthStateChanged(auth, async (user: TFirebaseUser) => {
			if (user) {
				setActiveSession({
					isAuthorized: true,
					user: {
						id: user.uid,
						email: user.email!,
					},
				})
			} else {
				setActiveSession({
					isAuthorized: false,
					user: null,
				})
			}
		})
	}, [])

	const value: IContext = useMemo(() => {
		return {
			data: { activeSession },
			actions: {},
			selectors: {},
		}
	}, [activeSession])
	return <Auth.Provider value={value}>{children}</Auth.Provider>
}
