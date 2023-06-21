import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Form, Button } from 'semantic-ui-react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import TextField from 'components/shared/TextField'
import Alert from 'components/shared/Alert'

import { useDisclosure } from 'context/Disclosure'

import { TSignFD } from 'ts/types/formData'
import { emailValidationPattern } from 'helpers/regex'

function SignInForm(): JSX.Element {
	const auth = getAuth()
	const navigate = useNavigate()
	const {
		handleSubmit,
		control,
		formState: { isValid },
	} = useForm<TSignFD>({
		mode: 'onBlur',
	})

	const {
		data: { isOpen, additionalInfo },
		actions: { onTemporaryOpen },
	} = useDisclosure()

	const [pending, setPending] = useState(false)

	async function onSubmit({ email, password }: TSignFD): Promise<void> {
		try {
			setPending(true)
			await signInWithEmailAndPassword(auth, email, password)
			setPending(false)
			navigate('/')
		} catch (err: any) {
			setPending(false)
			switch (err.message) {
				case 'Firebase: Error (auth/user-not-found).':
					onTemporaryOpen(4000, {
						header: 'Такого акаунту не існує',
						content: 'Спробуйте іншу електронну пошту або створіть новий обліковий запис',
					})
					break
				case 'Firebase: Error (auth/wrong-password).':
					onTemporaryOpen(4000, {
						header: 'Неправильний пароль',
						content: 'Якщо ви забули пароль, зверніться до адміністратора',
					})
					break
				default:
					onTemporaryOpen(3000, {
						header: 'Щось пішло не так',
						content: 'Будь ласка спробуйте ще раз',
					})
					break
			}
		}
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<TextField
				type='email'
				name='email'
				control={control}
				label='Електронна пошта'
				placeholder='Введіть свою електронну адресу'
				rules={{
					required: 'Введіть адресу електронної пошти',
					pattern: {
						value: emailValidationPattern,
						message: 'Будь ласка, введіть пошту ХНУРЕ',
					},
				}}
			/>
			<TextField
				type='password'
				name='password'
				control={control}
				label='Пароль'
				placeholder='Створити пароль'
				rules={{
					required: `Поле пароля є обов'язковим`,
				}}
			/>
			<Alert
				isOpen={isOpen}
				type='negative'
				header={additionalInfo?.header}
				content={additionalInfo?.content}
			/>
			<Button
				primary
				type='submit'
				disabled={!isValid || pending}
				loading={pending}
			>
				Увійти
			</Button>
		</Form>
	)
}

export default SignInForm
