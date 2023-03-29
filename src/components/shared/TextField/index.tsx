import { Form, Ref } from 'semantic-ui-react'
import { useController, UseControllerProps } from 'react-hook-form'

import { TTextFieldType } from 'ts/types/inputFields'

interface IProps {
	label?: string
	placeholder?: string
	type: TTextFieldType
}

function TextField(props: UseControllerProps & IProps): JSX.Element {
	const {
		field,
		fieldState: { error },
	} = useController(props)

	return (
		<Ref innerRef={field.ref}>
			<Form.Input
				type={props.type}
				onChange={field.onChange}
				onBlur={field.onBlur}
				value={field.value}
				name={field.name}
				label={props.label ?? ''}
				placeholder={props.placeholder ?? ''}
				error={error?.message ?? false}
			/>
		</Ref>
	)
}

export default TextField
