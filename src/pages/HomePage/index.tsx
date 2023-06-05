import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

import PageHeader from 'layouts/PageHeader'

import { useUser } from 'context/User'

import './styles.scss'

function HomePage(): JSX.Element {
	const {
		data: { currentUser },
	} = useUser()
	return (
		<div className='home'>
			<PageHeader />
			<main className='container pt-5'>
				{currentUser?.role === 'teacher' && (
					<Link to='/create-lecture'>
						<Button primary>Створити лекцію</Button>
					</Link>
				)}
			</main>
		</div>
	)
}

export default HomePage
