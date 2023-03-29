import { useForm } from 'react-hook-form'
import { Form, Button } from 'semantic-ui-react'

import TextField from 'components/shared/TextField'
import SelectField from 'components/shared/SelectField'

import { userRole } from 'helpers/selectOptions'

function CreateAccountForm(): JSX.Element {
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
				type='text'
				name='firsName'
				control={control}
				label='First Name'
				placeholder='Enter your First Name'
				rules={{
					required: 'This field is required',
				}}
			/>
			<TextField
				type='text'
				name='lastName'
				control={control}
				label='Last Name'
				placeholder='Enter your Last Name'
				rules={{
					required: 'This field is required',
				}}
			/>
			<SelectField
				name='role'
				control={control}
				options={userRole}
				label='Who you are?'
				placeholder='Select'
				rules={{
					required: 'You must select an option',
				}}
			/>
			<Button
				primary
				type='submit'
				disabled={!isValid}
			>
				Create
			</Button>
		</Form>
	)
}

export default CreateAccountForm
