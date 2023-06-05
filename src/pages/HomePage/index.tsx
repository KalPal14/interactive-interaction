import { Link } from 'react-router-dom'
import { Button, Header } from 'semantic-ui-react'

import PageHeader from 'layouts/PageHeader'
import LectureCardComponent from 'components/LectureCardComponent'

import { useUser } from 'context/User'
import { useLecture } from 'context/Lecture'
import { useGroup } from 'context/Group'

import { TTeacher } from 'ts/types/teacher'
import { TStudent } from 'ts/types/student'
import { TId } from 'ts/types/shared'

import './styles.scss'

function HomePage(): JSX.Element {
	const {
		data: { currentUser },
	} = useUser()
	const {
		data: { groups },
	} = useGroup()
	const {
		data: { lectures },
	} = useLecture()

	function getLecturesIdsList(): TId[] | [] {
		switch (currentUser?.role) {
			case 'teacher':
				currentUser as TTeacher
				return currentUser.lectures ?? []
			case 'student':
				currentUser as TStudent
				return groups[currentUser.group_id].lectures ?? []
			default:
				return []
		}
	}

	function renderLecturesList(): JSX.Element {
		const lecturesIdsList = getLecturesIdsList()
		const lecturesList = lecturesIdsList
			.map((lectureId) => lectures[lectureId])
			.filter((lecture) => lecture)

		if (lecturesList.length) {
			return (
				<section className='pt-5 pb-5 home__lectures-list row'>
					{lecturesList.map((lecture) => {
						return (
							<div
								key={lecture.id}
								className='p-1 col-xxl-2 col-lg-3 col-md-4 col-sm-6 col-12'
							>
								<LectureCardComponent lecture={lecture} />
							</div>
						)
					})}
				</section>
			)
		}
		return (
			<Header
				textAlign='center'
				size='medium'
			>
				Список лекцій порожній
			</Header>
		)
	}

	return (
		<div className='home'>
			<PageHeader />
			<main className='container pt-5'>
				<section className='home__control-panel'>
					{currentUser?.role === 'teacher' && (
						<Link to='/create-lecture'>
							<Button primary>Створити лекцію</Button>
						</Link>
					)}
				</section>
				{renderLecturesList()}
			</main>
		</div>
	)
}

export default HomePage
