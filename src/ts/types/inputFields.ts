export type TTextFieldType = 'email' | 'number' | 'password' | 'search' | 'text' | 'url'

export type TSelectOptionValue = string | number
export type TSelectOption = {
	key: TSelectOptionValue
	value: TSelectOptionValue
	text: string
}
export type TSelectOptionsList = TSelectOption[]

export type TDateFieldType = 'datetime-local' | 'date' | 'time'
export type TDateFieldValue =
	| `${string}-${string}-${string}`
	| `${string}-${string}-${string}T${string}:${string}`
