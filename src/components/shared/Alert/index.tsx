import { Message } from 'semantic-ui-react'
import { TAlertType } from 'ts/types/forJsx'
import cl from 'classnames'

interface IProps {
	isOpen: boolean
	type?: TAlertType
	header?: string
	content?: string
}

function Alert({ isOpen, type = 'info', header, content = '' }: IProps): JSX.Element {
	return (
		<Message
			className={cl('alert', { 'd-none': !isOpen })}
			negative={type === 'negative'}
			success={type === 'success'}
			warning={type === 'warning'}
			info={type === 'info'}
			header={header}
			content={content}
		/>
	)
}

export default Alert
