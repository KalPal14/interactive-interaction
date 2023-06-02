import AuthFormContainer from 'containers/AuthFormContainer'
import CreateAccountForm from 'components/CreateAccountForm'

function CreateAccountPage(): JSX.Element {
	return (
		<AuthFormContainer
			title='Create account'
			subtitle={`Last step. Provide some information about yourself.\n Already have an account?`}
			link={{
				to: '/sign-in',
				text: 'Sign In',
			}}
		>
			<CreateAccountForm />
		</AuthFormContainer>
	)
}

export default CreateAccountPage
