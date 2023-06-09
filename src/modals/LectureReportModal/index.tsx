import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Accordion, AccordionTitleProps, Button, Icon, Message, Modal } from 'semantic-ui-react'
import { uniq } from 'lodash'

import { useAnswer } from 'context/Answers'
import { useGroup } from 'context/Group'
import { useLecture } from 'context/Lecture'
import { useQuestion } from 'context/Question'
import { useStudent } from 'context/Student'
import { useSurvey } from 'context/Survey'

import { TId } from 'ts/types/shared'
import { TAnswersList } from 'ts/types/answer'

function LectureReportModal(): JSX.Element {
	const { id: lectureId } = useParams()

	const {
		data: { lectures },
	} = useLecture()
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
		data: { groups },
	} = useGroup()
	const {
		data: { students },
	} = useStudent()

	const [isOpen, setIsOpen] = useState(false)
	const [activeAccordionIndex, setActiveAccordionIndex] = useState(-1)

	const currentLecture = lectures[lectureId!]
	if (!currentLecture || !currentLecture.surveis) {
		return (
			<Button
				compact
				primary
				disabled
			>
				Звіт
			</Button>
		)
	}

	const answersList = Object.values(answers)
	const currentSurveys = currentLecture.surveis.map((surveyId) => surveys[surveyId])
	const tests = currentSurveys.filter((survey) => survey.is_test)
	const notTests = currentSurveys.filter((survey) => !survey.is_test)
	const currentGroups = currentLecture.groups.map((groupId) => groups[groupId])

	function onClose(): void {
		setIsOpen(false)
	}
	function onOpen(): void {
		setIsOpen(true)
	}

	function onAccordionClick(_: React.MouseEvent, { index }: AccordionTitleProps): void {
		activeAccordionIndex === index
			? setActiveAccordionIndex(-1)
			: setActiveAccordionIndex(index as number)
	}

	function calculateAmountOfRightAnswers(answers: TAnswersList): number {
		const rightAnswers = answers.filter(({ question_id, answer }) => {
			const { correct_answer } = questions[question_id]
			if (!correct_answer) return false
			return correct_answer === answer
		})
		return rightAnswers.length
	}

	function renderStudents(studentsIds: TId[]): JSX.Element[] {
		const currentStudents = studentsIds.map((studentId) => students[studentId])
		return currentStudents.map((student) => {
			const studentAnswers = answersList.filter(({ user_id }) => user_id === student.id)
			const studentQuestionsIds = uniq(studentAnswers.map(({ question_id }) => question_id))
			const studentQuestions = studentQuestionsIds.map((id) => questions[id])
			const studentTestQuestions = studentQuestions.filter(({ correct_answer }) => correct_answer)
			const studentSurveysIds = uniq(studentQuestions.map(({ survey_id }) => survey_id))
			const studentSurveys = studentSurveysIds.map((id) => surveys[id])
			const studentTests = studentSurveys.filter((survey) => survey.is_test)
			const studentNotTests = studentSurveys.filter((survey) => !survey.is_test)
			return (
				<Message>
					<Message.Header>
						{student.first_name} {student.last_name}
					</Message.Header>
					<Message.Content>
						<p>Відправив не перевірочних опитуваннь: {studentNotTests.length}</p>
						<p>Відправив тестів: {studentTests.length}</p>
						<p>
							Правильних відповідей: {calculateAmountOfRightAnswers(studentAnswers)} з{' '}
							{studentTestQuestions.length}
						</p>
					</Message.Content>
				</Message>
			)
		})
	}

	return (
		<Modal
			open={isOpen}
			onOpen={onOpen}
			onClose={onClose}
			trigger={
				<Button
					compact
					primary
				>
					Звіт
				</Button>
			}
			centered={false}
			size='small'
		>
			<Modal.Header>Звіт</Modal.Header>
			<Modal.Content
				scrolling
				className='pb-3'
			>
				<Modal.Description className='pb-5 mb-5'>
					<p>Усього тестів: {tests.length}</p>
					<p>Усього не перевірочних опитуваннь: {notTests.length}</p>
					<Accordion
						className='w-100'
						styled
					>
						{currentGroups.map((group, index) => {
							return (
								<>
									<Accordion.Title
										key={group.id}
										active={activeAccordionIndex === index}
										index={index}
										onClick={onAccordionClick}
									>
										<Icon name='dropdown' />
										{group.name}
									</Accordion.Title>
									<Accordion.Content
										key={group.id}
										active={activeAccordionIndex === index}
									>
										{renderStudents(group.students)}
									</Accordion.Content>
								</>
							)
						})}
					</Accordion>
				</Modal.Description>
			</Modal.Content>
		</Modal>
	)
}

export default LectureReportModal
