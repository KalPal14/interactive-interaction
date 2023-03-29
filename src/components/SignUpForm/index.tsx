import { useForm } from 'react-hook-form'
import { Form, Button } from 'semantic-ui-react'

import TextField from 'components/shared/TextField'

import { emailValidationPattern, passwordValidationPattern } from 'helpers/regex'

function SignUpForm(): JSX.Element {
	const {
		handleSubmit,
		control,
		formState: { isValid },
	} = useForm({
		mode: 'onBlur',
	})

	const onSubmit = (data: any) => console.log(data)

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
						message: 'Please enter a valid email address',
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
			<Button
				primary
				type='submit'
				disabled={!isValid}
			>
				Sign Up
			</Button>
		</Form>
	)
}

export default SignUpForm
