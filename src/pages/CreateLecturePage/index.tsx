import CreateLectureForm from 'components/CreateLectureForm'
import PageHeader from 'components/PageHeader'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'

function CreateLecturePage(): JSX.Element {
	return (
		<div className='create-lecture'>
			<PageHeader />
			<main className='container pt-5'>
				<Link to='/'>
					<Button
						className='mb-3'
						compact
						color='blue'
					>
						<Icon name='angle left' />
						Назад
					</Button>
				</Link>
				<CreateLectureForm />
			</main>
		</div>
	)
}

export default CreateLecturePage
