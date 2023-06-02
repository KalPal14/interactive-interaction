import { getAuth, signOut } from 'firebase/auth'
import { Button } from 'semantic-ui-react'
import './styles.scss'

function PageHeader(): JSX.Element {
	function onSignOutClick(): void {
		const auth = getAuth()
		signOut(auth)
	}

	return (
		<header className='page-header'>
			<div className='container page-header__content'>
				<Button
					onClick={onSignOutClick}
					secondary
				>
					Вийти
				</Button>
			</div>
		</header>
	)
}

export default PageHeader
