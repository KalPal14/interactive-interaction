import { List } from 'semantic-ui-react'

import { rightAnswerIcon, wrongAnswerIcon } from 'helpers/icons'

interface IProps {
	index: number
	isTest: boolean
	answer: string
	correctAnswer: string
}

function Answer({ index, answer, correctAnswer, isTest }: IProps): JSX.Element {
	if (isTest) {
		const isCorrect = correctAnswer === answer
		const icon = isCorrect ? rightAnswerIcon : wrongAnswerIcon
		return (
			<List.Item>
				<p>
					{icon} {answer}
				</p>
			</List.Item>
		)
	}

	return (
		<List.Item>
			{index + 1}. {answer}
		</List.Item>
	)
}

export default Answer
