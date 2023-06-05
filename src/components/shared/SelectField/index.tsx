import { Form, Ref } from 'semantic-ui-react'
import { useController, UseControllerProps, FieldValues } from 'react-hook-form'

import { TSelectOptionsList } from 'ts/types/inputFields'

interface IProps {
	label?: string
	placeholder?: string
	options: TSelectOptionsList
	disabled?: boolean
	multiple?: boolean
	clearable?: boolean
}

function SelectField<T extends FieldValues>(props: UseControllerProps<T> & IProps): JSX.Element {
	const {
		field,
		fieldState: { error },
	} = useController(props)

	return (
		<Ref innerRef={field.ref}>
			<Form.Dropdown
				search
				selection
				clearable={props.clearable ?? false}
				disabled={props.disabled ?? false}
				multiple={props.multiple ?? false}
				options={props.options}
				onChange={(_, { value }): void => {
					field.onChange(value)
				}}
				onBlur={field.onBlur}
				value={field.value}
				name={field.name}
				label={props.label ?? ''}
				placeholder={props.placeholder ?? ''}
				error={(error?.message || error?.type) ?? false}
			/>
		</Ref>
	)
}

export default SelectField
