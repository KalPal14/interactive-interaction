import AuthFormContainer from 'containers/AuthFormContainer'
import SignInForm from 'components/SignInForm'

function SignInPage(): JSX.Element {
	return (
		<AuthFormContainer
			title='Sign In'
			subtitle={`Don't have an account?`}
			link={{
				to: '/sign-up',
				text: 'Sign Up',
			}}
		>
			<SignInForm />
		</AuthFormContainer>
	)
}

export default SignInPage
