import { Header } from 'semantic-ui-react'

function NotFoundPage(): JSX.Element {
	return (
		<div className='w-100 h-100 d-flex align-items-center justify-content-center p-4'>
			<Header
				textAlign='center'
				as='h1'
			>
				Такої сторінки не існує
			</Header>
		</div>
	)
}

export default NotFoundPage
