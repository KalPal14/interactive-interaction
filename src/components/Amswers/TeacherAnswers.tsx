import { useParams } from 'react-router-dom'
import { Message, Header } from 'semantic-ui-react'

import { useAnswer } from 'context/Answers'
import { useQuestion } from 'context/Question'
import { useSurvey } from 'context/Survey'
import { useLecture } from 'context/Lecture'
import { useStudent } from 'context/Student'
import { useGroup } from 'context/Group'

import { TAnswersList } from 'ts/types/answer'
import Question from './Question'

function TeacherAnswers(): JSX.Element {
	const { surveyId } = useParams()

	const {
		data: { lectures },
	} = useLecture()
	const {
		data: { groups },
	} = useGroup()
	const {
		data: { students },
	} = useStudent()
	const {
		data: { surveys },
	} = useSurvey()
	const {
		data: { questions },
	} = useQuestion()
	const {
		data: { answers },
	} = useAnswer()

	const studentsList = Object.values(students)
	const answersList = Object.values(answers)
	const currentSurvey = surveys[surveyId!]
	const currentAnswers = answersList.filter(({ question_id }) => {
		const question = questions[question_id]
		return question.survey_id === surveyId
	})
	const currentGroupsIds = lectures[currentSurvey.lecture_id].groups || []
	const currentStudents = studentsList
		.filter(({ group_id }) => currentGroupsIds.includes(group_id))
		.map((student) => {
			const answers = answersList.filter(({ user_id, question_id }) => {
				const question = questions[question_id]
				return question.survey_id === surveyId && user_id === student.id
			})
			return {
				...student,
				answers,
			}
		})
	const questionsList = currentSurvey.questions.map((questionId) => questions[questionId])

	function renderQuestions(studentAnswers: TAnswersList): JSX.Element | JSX.Element[] {
		return questionsList.map((question) => {
			const answersForQuestion = studentAnswers.filter(
				({ question_id }) => question_id === question.id,
			)
			return (
				<Question
					key={question.id}
					question={question}
					survey={currentSurvey}
					answersList={answersForQuestion}
				/>
			)
		})
	}

	if (!currentAnswers.length) {
		return <Message>Учні не дали ще жодної відповіді</Message>
	}

	return (
		<>
			{currentStudents.map((student) => {
				if (!student.answers.length) return <></>
				return (
					<Message className='pb-0'>
						<Header
							as='h3'
							className='pb-3'
						>
							{student.first_name} {student.last_name} ({groups[student.group_id].name})
						</Header>
						{renderQuestions(student.answers)}
					</Message>
				)
			})}
		</>
	)
}

export default TeacherAnswers
