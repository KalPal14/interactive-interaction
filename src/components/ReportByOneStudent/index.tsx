import { Message } from 'semantic-ui-react'
import { uniqBy, flatten } from 'lodash'

import { useAnswer } from 'context/Answers'
import { useQuestion } from 'context/Question'
import { useStudent } from 'context/Student'

import { TAnswersList } from 'ts/types/answer'
import { TSurveysList } from 'ts/types/survey'
import { TQuestionsList } from 'ts/types/question'
import { TId } from 'ts/types/shared'
import { useSurvey } from 'context/Survey'

interface IProps {
	studentId: TId
	testSurveys: TSurveysList
	notTestSurveys: TSurveysList
}

function ReportByOneStudent({ studentId, testSurveys, notTestSurveys }: IProps): JSX.Element {
	const {
		data: { surveys },
	} = useSurvey()
	const {
		data: { questions },
	} = useQuestion()
	const {
		data: { answers },
	} = useAnswer()
	const {
		data: { students },
	} = useStudent()

	const student = students[studentId]
	if (!student) return <></>

	const testQuestions = getQuestions(testSurveys)
	const notTestQuestions = getQuestions(notTestSurveys)
	const testAnswers = getAnswers(testQuestions)
	const notTestAnswers = getAnswers(notTestQuestions)

	function getQuestions(surveysList: TSurveysList): TQuestionsList {
		const lectureQuestionsIds = surveysList.map(({ questions }) => questions)
		return flatten(lectureQuestionsIds).map((id) => questions[id])
	}

	function getAnswers(questionsList: TQuestionsList): TAnswersList {
		const lectureAnswersIds = questionsList.map(({ answers }) => answers)
		return flatten(lectureAnswersIds).map((id) => answers[id!])
	}

	function getStudentAnswers(answersList: TAnswersList): TAnswersList {
		if (!answersList.length) return []
		return answersList.filter((answer) => answer?.user_id === student.id)
	}

	function getStudentQuestions(answersList: TAnswersList): TQuestionsList {
		const questionsList = answersList.map(({ question_id }) => questions[question_id])
		return uniqBy(questionsList, 'id')
	}

	function getStudentSurveys(questionsList: TQuestionsList): TSurveysList {
		const surveysList = questionsList.map(({ survey_id }) => surveys[survey_id])
		return uniqBy(surveysList, 'id')
	}

	function calculateAmountOfRightAnswers(answers: TAnswersList): number {
		const rightAnswers = answers.filter(({ question_id, answer }) => {
			const { correct_answer } = questions[question_id]
			if (!correct_answer) return false
			return correct_answer === answer
		})
		return rightAnswers.length
	}

	const studentTestAnswers = getStudentAnswers(testAnswers)
	const studentNotTestAnswers = getStudentAnswers(notTestAnswers)
	const studentTestQuestions = getStudentQuestions(studentTestAnswers)
	const studentNotTestQuestions = getStudentQuestions(studentNotTestAnswers)
	const studentTests = getStudentSurveys(studentTestQuestions)
	const studentNotTests = getStudentSurveys(studentNotTestQuestions)
	return (
		<Message>
			<Message.Header>
				{student.first_name} {student.last_name}
			</Message.Header>
			<Message.Content>
				<p>Відправив не перевірочних опитуваннь: {studentNotTests.length}</p>
				<p>Відправив тестів: {studentTests.length}</p>
				<p>
					Правильних відповідей: {calculateAmountOfRightAnswers(studentTestAnswers)} з{' '}
					{studentTestQuestions.length}
				</p>
			</Message.Content>
		</Message>
	)
}

export default ReportByOneStudent
