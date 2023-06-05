import { TSelectOptionsList } from 'ts/types/inputFields'

export const userRole: TSelectOptionsList = [
	{
		key: 'student',
		value: 'student',
		text: 'Student',
	},
	{
		key: 'teacher',
		value: 'teacher',
		text: 'Teacher',
	},
]

export const lecturesTypeOptions: TSelectOptionsList = [
	{
		key: 'all',
		value: 'all',
		text: 'Усі лекції',
	},
	{
		key: 'today',
		value: 'today',
		text: 'На сьогодні',
	},
	{
		key: 'active',
		value: 'active',
		text: 'Йдуть зараз',
	},
	{
		key: 'notPast',
		value: 'notPast',
		text: 'Без минулих',
	},
	{
		key: 'past',
		value: 'past',
		text: 'Архів минулих',
	},
]
