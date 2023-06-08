import StudentAnswers from './StudentAnswers'

import { useUser } from 'context/User'
import TeacherAnswers from './TeacherAnswers'

function Answers(): JSX.Element {
	const {
		data: { currentUser },
	} = useUser()

	function renderAnswers(): JSX.Element {
		switch (currentUser?.role) {
			case 'student':
				return <StudentAnswers />
			case 'teacher':
				return <TeacherAnswers />
			default:
				return <></>
		}
	}

	return <div>{renderAnswers()}</div>
}

export default Answers
