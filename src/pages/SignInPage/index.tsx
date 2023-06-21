import AuthFormContainer from 'containers/AuthFormContainer'
import SignInForm from 'components/SignInForm'

function SignInPage(): JSX.Element {
	return (
		<AuthFormContainer
			title='Увійти'
			subtitle={`Немає облікового запису?`}
			link={{
				to: '/sign-up',
				text: 'Зареєструватися',
			}}
		>
			<SignInForm />
		</AuthFormContainer>
	)
}

export default SignInPage
