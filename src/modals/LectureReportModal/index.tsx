import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Accordion, AccordionTitleProps, Button, Icon, Modal } from 'semantic-ui-react'

import ReportByOneStudent from 'components/ReportByOneStudent'

import { useGroup } from 'context/Group'
import { useLecture } from 'context/Lecture'
import { useSurvey } from 'context/Survey'

function LectureReportModal(): JSX.Element {
	const { id: lectureId } = useParams()

	const {
		data: { lectures },
	} = useLecture()
	const {
		data: { surveys },
	} = useSurvey()
	const {
		data: { groups },
	} = useGroup()

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

	const currentSurveys = currentLecture.surveis.map((surveyId) => surveys[surveyId])
	const curTestsSurveys = currentSurveys.filter((survey) => survey.is_test)
	const curNotTestsSurveys = currentSurveys.filter((survey) => !survey.is_test)
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
					<p>Усього тестів: {curTestsSurveys.length}</p>
					<p>Усього не перевірочних опитуваннь: {curNotTestsSurveys.length}</p>
					<Accordion
						className='w-100'
						styled
					>
						{currentGroups.map((group, index) => {
							return (
								<div key={group.id}>
									<Accordion.Title
										active={activeAccordionIndex === index}
										index={index}
										onClick={onAccordionClick}
									>
										<Icon name='dropdown' />
										{group.name}
									</Accordion.Title>
									<Accordion.Content active={activeAccordionIndex === index}>
										{group.students.map((id) => (
											<ReportByOneStudent
												key={id}
												studentId={id}
												notTestSurveys={curNotTestsSurveys}
												testSurveys={curTestsSurveys}
											/>
										))}
									</Accordion.Content>
								</div>
							)
						})}
					</Accordion>
				</Modal.Description>
			</Modal.Content>
		</Modal>
	)
}

export default LectureReportModal
