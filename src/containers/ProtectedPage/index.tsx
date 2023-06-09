import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from 'context/User'

import { TAccessRole } from 'ts/types/shared'

interface IProps {
	children: JSX.Element
	accessFor: TAccessRole
}

function ProtectedPage({ children, accessFor }: IProps): JSX.Element {
	const navigate = useNavigate()

	const {
		data: { currentUser },
	} = useUser()

	const callsCount = useRef(1)
	useEffect(() => {
		if (callsCount.current >= 2) {
			checkAccessRights()
		}
		callsCount.current++
	}, [currentUser])

	function checkAccessRights(): void {
		switch (accessFor) {
			case 'guest':
				redirectIfNotGuest()
				break
			case 'userWithAccount':
				redirectIfNotUserWithAccount()
				break
			case 'userWithoutAccount':
				redirectIfNotUserWithoutAccount()
				break
			case 'teacher':
				redirectIfNotTeacher()
		}
	}

	function redirectIfNotGuest(): void {
		if (currentUser) {
			navigate('/')
		}
	}

	function redirectIfNotUserWithAccount(): void {
		if (!currentUser) {
			navigate('/sign-in')
			return
		}
		if (currentUser.role === 'authorized') {
			navigate('/create-account')
		}
	}

	function redirectIfNotUserWithoutAccount(): void {
		if (!currentUser) {
			navigate('/sign-in')
			return
		}
		switch (currentUser.role) {
			case 'student':
			case 'teacher':
				navigate('/')
		}
	}

	function redirectIfNotTeacher(): void {
		if (!currentUser) {
			navigate('/sign-in')
			return
		}
		if (currentUser.role !== 'teacher') {
			navigate('/')
		}
	}

	return <>{children}</>
}

export default ProtectedPage
