import { Message, Header } from 'semantic-ui-react'

import { useAnswer } from 'context/Answers'
import { useQuestion } from 'context/Question'
import { useSurvey } from 'context/Survey'
import { useUser } from 'context/User'
import { useParams } from 'react-router-dom'
import { TAnswersList } from 'ts/types/answer'
import { TQuestion } from 'ts/types/question'
import Question from './Question'

function StudentAnswers(): JSX.Element {
	const { surveyId } = useParams()

	const {
		data: { currentUser },
	} = useUser()
	const {
		data: { surveys },
	} = useSurvey()
	const {
		data: { questions },
	} = useQuestion()
	const {
		data: { answers },
	} = useAnswer()

	const currentSurvey = surveys[surveyId!]
	const questionsList = currentSurvey.questions.map((questionId) => questions[questionId])
	const isAnswersExist = checkAnswersExistence()

	function getAnswersList(question: TQuestion): TAnswersList {
		if (!question.answers) return []
		return question.answers
			.map((answerId) => answers[answerId])
			.filter((answer) => answer.user_id === currentUser?.id)
	}

	function checkAnswersExistence(): boolean {
		const answersOnFirstQuestion = getAnswersList(questionsList[0])
		return answersOnFirstQuestion.length === 0 ? false : true
	}

	function renderQuestions(): JSX.Element | JSX.Element[] {
		if (!isAnswersExist) {
			return <Message.Content className='pb-3'>Ви поки що не давали відповідей</Message.Content>
		}
		return questionsList.map((question) => (
			<Question
				key={question.id}
				question={question}
				survey={currentSurvey}
				answersList={getAnswersList(question)}
			/>
		))
	}

	return (
		<Message className='pb-1'>
			<Header
				as='h3'
				className='pb-3'
			>
				Ваші відповіді
			</Header>
			{renderQuestions()}
		</Message>
	)
}

export default StudentAnswers
