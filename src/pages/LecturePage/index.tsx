import { Link, useParams } from 'react-router-dom'
import { Button, Card, Header, Icon } from 'semantic-ui-react'
import dateFormat from 'dateformat'

import PageHeader from 'layouts/PageHeader'
import LectureReportModal from 'modals/LectureReportModal'
import CreateSurveyModal from 'modals/CreateSurveyModal'

import { useUser } from 'context/User'
import { useSurvey } from 'context/Survey'
import { useLecture } from 'context/Lecture'

import './styles.scss'

function LecturePage(): JSX.Element {
	const { id: lectureId } = useParams()
	const {
		data: { currentUser },
	} = useUser()
	const {
		data: { surveys },
	} = useSurvey()
	const {
		data: { lectures },
	} = useLecture()

	const currentLecture = lectures[lectureId!]

	function renderSurveysList(): JSX.Element {
		if (!currentLecture) {
			return renderEmptyMessage()
		}
		const surveysList =
			currentLecture.surveis?.map((surveyId) => surveys[surveyId]).filter((survey) => survey) ?? []

		if (surveysList.length) {
			return (
				<section className='pt-5 pb-5 lecture__surveys-list row'>
					{surveysList.map((survey) => {
						return (
							<div
								key={survey.id}
								className='p-1 col-xxl-2 col-lg-3 col-md-4 col-sm-6 col-12'
							>
								<Link to={`/lecture/${lectureId}/survey/${survey.id}`}>
									<Card className='w-100 h-100'>
										<Card.Content>
											<Card.Header>{survey.name}</Card.Header>
											<Card.Meta style={{ color: '#2185d0' }}>
												{survey.is_test ? 'Тест' : 'Опитування'}
											</Card.Meta>
										</Card.Content>
										<Card.Content>
											<Card.Description>
												<p>Кількість питань: {survey.questions.length}</p>
												<p>Час створення: {dateFormat(new Date(survey.created_at), 'HH:MM')}</p>
												<p>
													Дата створення: {dateFormat(new Date(survey.created_at), 'dd-mm-yyyy')}
												</p>
											</Card.Description>
										</Card.Content>
									</Card>
								</Link>
							</div>
						)
					})}
				</section>
			)
		}
		return renderEmptyMessage()
	}

	function renderEmptyMessage(): JSX.Element {
		return (
			<Header
				textAlign='center'
				size='medium'
			>
				Ця лекція поки пророжня
			</Header>
		)
	}

	return (
		<div className='lecture'>
			<PageHeader />
			<main className='container pt-5'>
				<section className='lecture__control-panel'>
					<Link to='/'>
						<Button
							compact
							color='blue'
						>
							<Icon name='angle left' />
							Назад
						</Button>
					</Link>
					{currentUser?.role === 'teacher' && (
						<div className='lecture__control-panel-right'>
							<LectureReportModal />
							<CreateSurveyModal />
						</div>
					)}
				</section>
				{renderSurveysList()}
			</main>
		</div>
	)
}

export default LecturePage
