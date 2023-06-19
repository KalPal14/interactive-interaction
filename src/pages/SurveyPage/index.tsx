import { Link, useParams } from 'react-router-dom'
import { Button, Header, Icon } from 'semantic-ui-react'

import PageHeader from 'components/PageHeader'
import SurveyForm from 'components/SurveyForm'
import Amswers from 'components/Amswers'

import { useUser } from 'context/User'

import './styles.scss'

function SurveyPage(): JSX.Element {
	const { lectureId } = useParams()
	const {
		data: { currentUser },
	} = useUser()

	return (
		<div className='survey pb-5'>
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
					{currentUser?.role === 'teacher' && (
						<Header>Демонстрація того, як студенти бачать створену форму</Header>
					)}
					<SurveyForm />
				</section>
				<section className='pt-5'>
					<Amswers />
				</section>
			</main>
		</div>
	)
}

export default SurveyPage
