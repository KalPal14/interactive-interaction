import { Link } from 'react-router-dom'
import { Button, Header, Icon } from 'semantic-ui-react'
// import { useForm } from 'react-hook-form'
// import dateFormat from 'dateformat'

import PageHeader from 'layouts/PageHeader'
// import LectureCardComponent from 'components/LectureCardComponent'
// import SelectField from 'components/shared/SelectField'

import { useUser } from 'context/User'
// import { useLecture } from 'context/Lecture'
// import { useGroup } from 'context/Group'

// import { TLecture } from 'ts/types/lecture'
// import { TTeacher } from 'ts/types/teacher'
// import { TStudent } from 'ts/types/student'
// import { TId } from 'ts/types/shared'

// import { lecturesTypeOptions } from 'helpers/selectOptions'

import './styles.scss'
import CreateSurveyModal from 'modals/CreateSurveyModal'

function LecturePage(): JSX.Element {
	// const { control, watch } = useForm<any>({
	// 	mode: 'onBlur',
	// })
	const {
		data: { currentUser },
	} = useUser()
	// const {
	// 	data: { groups },
	// } = useGroup()
	// const {
	// 	data: { lectures },
	// } = useLecture()

	// const selectedLecturesType = watch('type')

	// function getLecturesIdsList(): TId[] | [] {
	// 	switch (currentUser?.role) {
	// 		case 'teacher':
	// 			currentUser as TTeacher
	// 			return currentUser.lectures ?? []
	// 		case 'student':
	// 			currentUser as TStudent
	// 			return groups[currentUser.group_id].lectures ?? []
	// 		default:
	// 			return []
	// 	}
	// }

	// function filterByType({ start_date, end_date }: TLecture): boolean {
	// 	const now = new Date()
	// 	switch (selectedLecturesType) {
	// 		case 'today':
	// 			return end_date.split('T')[0] === dateFormat(now, 'yyyy-mm-dd')
	// 		case 'active':
	// 			return now >= new Date(start_date) && now <= new Date(end_date)
	// 		case 'notPast':
	// 			return now < new Date(end_date)
	// 		case 'past':
	// 			return now > new Date(end_date)
	// 		case 'all':
	// 		default:
	// 			return true
	// 	}
	// }

	function renderTopicsList(): JSX.Element {
		// const lecturesIdsList = getLecturesIdsList()
		// const lecturesList = lecturesIdsList
		// 	.map((lectureId) => lectures[lectureId])
		// 	.filter((lecture) => lecture)
		// 	.filter((lecture) => filterByType(lecture))
		// const sortedLecturesList = [...lecturesList].sort(
		// 	(a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
		// )

		// if (sortedLecturesList.length) {
		// 	return (
		// 		<section className='pt-5 pb-5 home__lectures-list row'>
		// 			{sortedLecturesList.map((lecture) => {
		// 				return (
		// 					<div
		// 						key={lecture.id}
		// 						className='p-1 col-xxl-2 col-lg-3 col-md-4 col-sm-6 col-12'
		// 					>
		// 						<LectureCardComponent lecture={lecture} />
		// 					</div>
		// 				)
		// 			})}
		// 		</section>
		// 	)
		// }
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
							<CreateSurveyModal />
						</div>
					)}
				</section>
				{renderTopicsList()}
			</main>
		</div>
	)
}

export default LecturePage
