import { Link } from 'react-router-dom'
import { Card } from 'semantic-ui-react'

import { useTeacher } from 'context/Teacher'
import { useGroup } from 'context/Group'
import { usePredmet } from 'context/Predmet'

import { TLecture } from 'ts/types/lecture'

import { getLectureType } from 'helpers/functions'

interface IProps {
	lecture: TLecture
}

function LectureCardComponent({ lecture }: IProps): JSX.Element {
	const {
		data: { teachers },
	} = useTeacher()
	const {
		data: { groups },
	} = useGroup()
	const {
		data: { predmets },
	} = usePredmet()

	const teacher = teachers[lecture.teacher_id]
	const predmet = predmets[lecture.predmet_id]
	const groupsNamesList = lecture.groups
		.map((groupId) => groups[groupId].name)
		.filter((value) => value)

	if (!teacher || !lecture.groups.length || !predmet) {
		return <></>
	}

	const lectureType = getLectureType(lecture)

	return (
		<div
			key={lecture.id}
			className='p-1 col-xxl-2 col-lg-3 col-md-4 col-sm-6 col-12'
		>
			<Link to={`lecture/${lecture.id}`}>
				<Card className='w-100 h-100'>
					<Card.Content>
						<Card.Header>{lecture.name}</Card.Header>
						<Card.Meta style={{ color: lectureType.color }}>{lectureType.text}</Card.Meta>
					</Card.Content>
					<Card.Content>
						<Card.Description>
							<p>Предмет: {predmet.name}</p>
							<p>
								Викладач: {teacher.first_name} {teacher.last_name}
							</p>
							<p>Студенти: {groupsNamesList.join(', ')}</p>
							<p>Дата: {lecture.start_date.split('T')[0]}</p>
							<p>
								Час: {lecture.start_date.split('T')[1]}-{lecture.end_date.split('T')[1]}
							</p>
						</Card.Description>
					</Card.Content>
				</Card>
			</Link>
		</div>
	)
}

export default LectureCardComponent
