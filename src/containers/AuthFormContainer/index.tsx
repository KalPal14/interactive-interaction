import { Link } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import { TLink } from 'ts/types/forJsx'
import { defLinkValues } from 'helpers/defaultValues'

import './styles.scss'

interface IProps {
	children: JSX.Element
	title: string
	subtitle?: string
	link?: TLink
}

function AuthFormContainer({
	children,
	title,
	subtitle = '',
	link = defLinkValues,
}: IProps): JSX.Element {
	return (
		<div className='auth__page'>
			<div className='auth__form-container'>
				<Header as='h1'>{title}</Header>
				<p>
					{subtitle} <Link to={link.to}>{link?.text}</Link>
				</p>
				{children}
			</div>
		</div>
	)
}

export default AuthFormContainer
