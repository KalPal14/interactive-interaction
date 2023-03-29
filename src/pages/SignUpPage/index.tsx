import AuthFormContainer from 'containers/AuthFormContainer'
import SignUpForm from 'components/SignUpForm'

function SignUpPage(): JSX.Element {
	return (
		<AuthFormContainer
			title='Sign Up'
			subtitle='Already have an account?'
			link={{
				to: '/sign-in',
				text: 'Sign In',
			}}
		>
			<SignUpForm />
		</AuthFormContainer>
	)
}

export default SignUpPage
