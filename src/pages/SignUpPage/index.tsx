import AuthFormContainer from 'containers/AuthFormContainer'
import SignUpForm from 'components/SignUpForm'

function SignUpPage(): JSX.Element {
	return (
		<AuthFormContainer
			title='Зареєструватися'
			subtitle='Вже є аккаунт?'
			link={{
				to: '/sign-in',
				text: 'Увійти',
			}}
		>
			<SignUpForm />
		</AuthFormContainer>
	)
}

export default SignUpPage
