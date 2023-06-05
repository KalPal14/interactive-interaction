import { Link } from 'react-router-dom'
import { Card, Header } from 'semantic-ui-react'

import { useTeacher } from 'context/Teacher'
import { useGroup } from 'context/Group'

import { TLecture } from 'ts/types/lecture'

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
	const teacher = teachers[lecture.teacher_id]
	const groupsNamesList = lecture.groups
		.map((groupId) => groups[groupId].name)
		.filter((value) => value)
	if (!teacher || !lecture.groups.length) {
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
		<Link to={`lecture/${lecture.id}`}>
			<Card className='w-100 h-100'>
				<Card.Content header={lecture.name} />
				<Card.Content>
					<Card.Description>
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
	)
}

export default LectureCardComponent
