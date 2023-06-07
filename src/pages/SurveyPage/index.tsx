import { Link, useParams } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'

import PageHeader from 'layouts/PageHeader'
import SurveyForm from 'components/SurveyForm'

// import { useUser } from 'context/User'
// import { useSurvey } from 'context/Survey'
// import { useLecture } from 'context/Lecture'

import './styles.scss'

function SurveyPage(): JSX.Element {
	const { lectureId } = useParams()
	// const {
	// 	data: { currentUser },
	// } = useUser()
	// const {
	// 	data: { surveys },
	// } = useSurvey()
	// const {
	// 	data: { lectures },
	// } = useLecture()

	return (
		<div className='survey'>
			<PageHeader />
			<main className='container pt-5'>
				<section>
					<Link to={`/lecture/${lectureId}`}>
						<Button
							compact
							color='blue'
						>
							<Icon name='angle left' />
							Назад
						</Button>
					</Link>
				</section>
				<section className='pt-5'>
					<SurveyForm />
				</section>
			</main>
		</div>
	)
}

export default SurveyPage
