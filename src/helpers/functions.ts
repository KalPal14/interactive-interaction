import { TLecture } from 'ts/types/lecture'

export function getLectureType(lecture: TLecture): { text: string; color: string } {
	const { start_date, end_date } = lecture
	const now = new Date()
	if (now >= new Date(start_date) && now <= new Date(end_date)) {
		return {
			text: 'Йде зараз',
			color: '#db2828',
		}
	}
	if (now > new Date(end_date)) {
		return {
			text: 'Архівна',
			color: '',
		}
	}
	if (now < new Date(start_date)) {
		return {
			text: 'Майбутня',
			color: '#2185d0',
		}
	}
	return {
		text: '',
		color: '',
	}
}
