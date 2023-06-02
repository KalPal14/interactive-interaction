/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from 'react'
import { redirect, useNavigate } from 'react-router-dom'

import { useAuth } from 'context/Auth'
import { useStudent } from 'context/Student'
import { useTeacher } from 'context/Teacher'

import { TAccess } from 'ts/types/auth'

interface IProps {
	children: JSX.Element
	accessFor: TAccess
}

function ProtectedPage({ children, accessFor }: IProps): JSX.Element {
	const navigate = useNavigate()
	const {
		data: { activeSession },
	} = useAuth()
	const {
		data: { students },
	} = useStudent()
	const {
		data: { teachers },
	} = useTeacher()

	//this counter is needed because of the peculiarities of the firebase. The first two results when the page is first opened are always not authorized
	const activeSessionChangingCount = useRef(1)
	useEffect(() => {
		if (activeSessionChangingCount.current >= 3) {
			checkAccessRights()
		}
		activeSessionChangingCount.current++
	}, [activeSession, students, teachers])

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
		}
	}

	function redirectIfNotGuest(): void {
		if (!activeSession.isAuthorized) {
			navigate('/sign-in')
		}
	}

	function redirectIfNotUserWithAccount(): void {
		if (!activeSession.user) {
			navigate('/sign-in')
			return
		}
		const student = students[activeSession.user.id]
		const teacher = teachers[activeSession.user.id]
		if (!student && !teacher) {
			navigate('/create-account')
		}
	}

	function redirectIfNotUserWithoutAccount(): void {
		if (!activeSession.user) {
			navigate('/sign-in')
			return
		}
		const student = students[activeSession.user.id]
		const teacher = teachers[activeSession.user.id]
		if (student || teacher) {
			navigate('/')
		}
	}

	return <>{children}</>
}

export default ProtectedPage
