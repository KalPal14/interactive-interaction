import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button } from 'semantic-ui-react'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import TextField from 'components/shared/TextField'
import Alert from 'components/shared/Alert'

import { useDisclosure } from 'context/Disclosure'

import { emailValidationPattern, passwordValidationPattern } from 'helpers/regex'
import { TSignFD } from 'ts/types/formData'

function SignUpForm(): JSX.Element {
	const {
		handleSubmit,
		control,
		formState: { isValid },
	} = useForm<TSignFD>({
		mode: 'onBlur',
	})
	const navigate = useNavigate()
	const {
		data: { isOpen, additionalInfo },
		actions: { onTemporaryOpen },
	} = useDisclosure()

	const [pending, setPending] = useState(false)

	async function onSubmit({ email, password }: TSignFD): Promise<void> {
		try {
			setPending(true)
			const auth = getAuth()
			await createUserWithEmailAndPassword(auth, email, password)
			setPending(false)
			navigate('/create-account')
		} catch (err: any) {
			setPending(false)
			switch (err.message) {
				case 'Firebase: Error (auth/email-already-in-use).':
					onTemporaryOpen(4000, {
						header: 'Такий обліковий запис уже існує',
						content:
							'Ви можете увійти за цією поштою або зареєструватися за іншою, якої немає в системі',
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
				placeholder='Введіть адресу електронної пошти'
				rules={{
					required: `Поле електронної пошти обов'язкове`,
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
					pattern: {
						value: passwordValidationPattern,
						message:
							'Пароль повинен містити не менше 6 символів, принаймні одну літеру та одну цифру',
					},
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
				Зареєструватися
			</Button>
		</Form>
	)
}

export default SignUpForm
