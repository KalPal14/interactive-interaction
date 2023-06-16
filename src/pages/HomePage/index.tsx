import { Link } from 'react-router-dom'
import { Button, Header, Form } from 'semantic-ui-react'
import { useForm } from 'react-hook-form'
import dateFormat from 'dateformat'

import PageHeader from 'components/PageHeader'
import LectureCardComponent from 'components/LectureCardComponent'
import SelectField from 'components/shared/SelectField'

import { useUser } from 'context/User'
import { useLecture } from 'context/Lecture'
import { useGroup } from 'context/Group'

import { TId } from 'ts/types/shared'
import { TLecture } from 'ts/types/lecture'
import { TTeacher } from 'ts/types/teacher'
import { TStudent } from 'ts/types/student'
import { TLecturesListFiltersFD } from 'ts/types/formData'

import { lecturesTypeOptions } from 'helpers/selectOptions'

import './styles.scss'

function HomePage(): JSX.Element {
	const { control, watch } = useForm<TLecturesListFiltersFD>({
		mode: 'onBlur',
	})

	const {
		data: { currentUser },
	} = useUser()
	const {
		data: { groups },
	} = useGroup()
	const {
		data: { lectures },
	} = useLecture()

	const selectedLecturesType = watch('type')

	function getLecturesIdsList(): TId[] | [] {
		switch (currentUser?.role) {
			case 'teacher':
				currentUser as TTeacher
				return currentUser.lectures ?? []
			case 'student':
				currentUser as TStudent
				return groups[currentUser.group_id]?.lectures ?? []
			default:
				return []
		}
	}

	function filterByType({ start_date, end_date }: TLecture): boolean {
		const now = new Date()
		switch (selectedLecturesType) {
			case 'today':
				return end_date.split('T')[0] === dateFormat(now, 'yyyy-mm-dd')
			case 'active':
				return now >= new Date(start_date) && now <= new Date(end_date)
			case 'notPast':
				return now < new Date(end_date)
			case 'past':
				return now > new Date(end_date)
			case 'all':
			default:
				return true
		}
	}

	function renderLecturesList(): JSX.Element {
		const lecturesIdsList = getLecturesIdsList()
		const lecturesList = lecturesIdsList
			.map((lectureId) => lectures[lectureId])
			.filter((lecture) => lecture)
			.filter((lecture) => filterByType(lecture))
		const sortedLecturesList = [...lecturesList].sort(
			(a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
		)

		if (sortedLecturesList.length) {
			return (
				<section className='pt-5 pb-5 home__lectures-list row'>
					{sortedLecturesList.map((lecture) => {
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
					<Form className='home__filters'>
						<SelectField
							name='type'
							control={control}
							options={lecturesTypeOptions}
							defaultValue={lecturesTypeOptions[0].key as string}
							label='Тип'
							rules={{
								required: false,
							}}
							compact={true}
						/>
					</Form>
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
