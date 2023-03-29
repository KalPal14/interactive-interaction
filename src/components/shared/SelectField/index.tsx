import { Form, Ref } from 'semantic-ui-react'
import { useController, UseControllerProps } from 'react-hook-form'

import { TSelectOptionsList } from 'ts/types/inputFields'

interface IProps {
	label?: string
	placeholder?: string
	options: TSelectOptionsList
}

function SelectField(props: UseControllerProps & IProps): JSX.Element {
	const {
		field,
		fieldState: { error },
	} = useController(props)

	return (
		<Ref innerRef={field.ref}>
			<Form.Dropdown
				search
				selection
				options={props.options}
				onChange={(_, { value }) => {
					field.onChange(value)
				}}
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

export default SelectField
