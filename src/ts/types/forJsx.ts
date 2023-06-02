export type TLink = {
	text: string
	to: string
}

export type TAlertType = 'success' | 'negative' | 'warning' | 'info'
export type TAlert = {
	isOpen: boolean
	type: TAlertType
	header: string
	content?: string
}
