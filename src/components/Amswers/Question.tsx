import { List, Header } from 'semantic-ui-react'

import Answer from './Answer'

import { TQuestion } from 'ts/types/question'
import { TSurvey } from 'ts/types/survey'
import { TAnswersList } from 'ts/types/answer'

interface IProps {
	question: TQuestion
	survey: TSurvey
	answersList: TAnswersList
}

function Question({ question, survey, answersList }: IProps): JSX.Element {
	return (
		<>
			<Header as='h5'>{question.label ?? survey.name}</Header>
			<List
				className='pb-2 mb-1 mt-1'
				style={{ paddingLeft: '1rem' }}
			>
				{answersList.map(({ id, answer }, index) => (
					<Answer
						key={id}
						index={index}
						isTest={survey?.is_test ?? false}
						answer={answer}
						correctAnswer={question.correct_answer ?? ''}
					/>
				))}
			</List>
		</>
	)
}

export default Question
