import AuthFormContainer from 'containers/AuthFormContainer'
import CreateAccountForm from 'components/CreateAccountForm'

function CreateAccountPage(): JSX.Element {
	return (
		<AuthFormContainer
			title='Створити акаунт'
			subtitle={`Останній крок. Надайте деяку інформацію про себе.\n Уже маєте обліковий запис?`}
			link={{
				to: '/sign-in',
				text: 'Увійти',
			}}
		>
			<CreateAccountForm />
		</AuthFormContainer>
	)
}

export default CreateAccountPage
