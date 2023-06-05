import { Form, Ref } from 'semantic-ui-react'
import { useController, UseControllerProps, FieldValues } from 'react-hook-form'
import { TDateFieldType } from 'ts/types/inputFields'

interface IProps {
	label?: string
	placeholder?: string
	type: TDateFieldType
	min?: string
	max?: string
	disabled?: boolean
}

function DateField<T extends FieldValues>(props: UseControllerProps<T> & IProps): JSX.Element {
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
				min={props.min}
				max={props.max}
				disabled={props.disabled}
				label={props.label ?? ''}
				placeholder={props.placeholder ?? ''}
				error={(error?.message || error?.type) ?? false}
			/>
		</Ref>
	)
}

export default DateField
