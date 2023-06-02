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
						header: 'This account already exists',
						content:
							'You can log in using this mail or register using another one that is not in the system',
					})
					break
				default:
					onTemporaryOpen(3000, {
						header: 'Something went wrong',
						content: 'Please try again',
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
				label='Email'
				placeholder='Enter your email'
				rules={{
					required: 'Email field is required',
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
				label='Password'
				placeholder='Create password'
				rules={{
					required: 'Password field is required',
					pattern: {
						value: passwordValidationPattern,
						message:
							'Password must contain at least 6 characters, at least one letter and one number',
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
				Sign Up
			</Button>
		</Form>
	)
}

export default SignUpForm
