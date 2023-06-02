import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'

import TextField from 'components/shared/TextField'
import SelectField from 'components/shared/SelectField'

import { useAuth } from 'context/Auth'
import { useFaculty } from 'context/Faculty'
import { useDepartment } from 'context/Department'
import { useGroup } from 'context/Group'
import { useStudent } from 'context/Student'
import { useTeacher } from 'context/Teacher'

import { TCreateAccountFD } from 'ts/types/formData'

import { userRole } from 'helpers/selectOptions'

function CreateAccountForm(): JSX.Element {
	const navigate = useNavigate()
	const {
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { isValid },
	} = useForm<TCreateAccountFD>({
		mode: 'onBlur',
	})

	const {
		data: { activeSession },
	} = useAuth()
	const {
		data: { facultiesOptions },
	} = useFaculty()
	const {
		actions: { updateDepartmentListField },
		selectors: { selectDepartmentsOptionsBy },
	} = useDepartment()
	const {
		actions: { updateGroupListField },
		selectors: { selectGroupsOptionsBy },
	} = useGroup()
	const {
		actions: { setNewStudent },
	} = useStudent()
	const {
		actions: { setNewTeacher },
	} = useTeacher()

	const selectedFaculty = watch('faculty')
	const selectedDepartmet = watch('department')
	const selectedRole = watch('role')

	useEffect(() => {
		setValue('department', '')
	}, [selectedFaculty, setValue])
	useEffect(() => {
		setValue('group', '')
	}, [selectedRole, selectedDepartmet, setValue])

	function onSubmit(formData: TCreateAccountFD): void {
		try {
			if (selectedRole === 'student') {
				createNewStudent(formData)
			} else {
				createNewTeacher(formData)
			}
			navigate('/')
		} catch (err) {
			console.log(err)
		}
	}

	function createNewStudent(formData: TCreateAccountFD): void {
		if (!activeSession.user) return
		setNewStudent({
			...activeSession.user,
			first_name: formData.firstName,
			last_name: formData.lastName,
			group_id: formData.group,
		})
		updateGroupListField({
			value: [activeSession.user.id],
			groupId: formData.group,
			listName: 'students',
		})
		return
	}

	function createNewTeacher(formData: TCreateAccountFD): void {
		if (!activeSession.user) return
		setNewTeacher({
			...activeSession.user,
			first_name: formData.firstName,
			last_name: formData.lastName,
			department_id: formData.department,
		})
		updateDepartmentListField({
			value: [activeSession.user.id],
			departmentId: formData.department,
			listName: 'teachers',
		})
		return
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<TextField
				type='text'
				name='firstName'
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
				name='faculty'
				control={control}
				options={facultiesOptions}
				label='Faculty'
				placeholder='Select your faculty'
				rules={{
					required: 'You must select an option',
				}}
			/>
			<SelectField
				name='department'
				control={control}
				options={selectDepartmentsOptionsBy({ faculies: [selectedFaculty] })}
				disabled={!selectedFaculty}
				label='Department'
				placeholder='Select your department'
				rules={{
					required: 'You must select an option',
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
			{selectedRole === 'student' && (
				<SelectField
					name='group'
					control={control}
					options={selectGroupsOptionsBy({ departments: [selectedDepartmet] })}
					disabled={!watch('faculty')}
					label='Group'
					placeholder='Select your group'
					rules={{
						required: 'You must select an option',
					}}
				/>
			)}
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
