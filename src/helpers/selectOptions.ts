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

export const questionFieldTypeOptions: TSelectOptionsList = [
	{
		key: 'text',
		value: 'text',
		text: 'Текстова відповідь',
	},
	// {
	// 	key: 'textarea',
	// 	value: 'textarea',
	// 	text: 'Розгорнута текстова відповідь',
	// },
	{
		key: 'select',
		value: 'select',
		text: 'Вибрати варіант зі списку',
	},
	// {
	// 	key: 'multiselect',
	// 	value: 'multiselect',
	// 	text: 'Вибрати декілька варіанів зі списку',
	// },
]

export const trueFalseOptions: TSelectOptionsList = [
	{
		key: 'true',
		value: 'true',
		text: 'Так',
	},
	{
		key: 'false',
		value: 'false',
		text: 'Ні',
	},
]
