import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'

import TextField from 'components/shared/TextField'
import SelectField from 'components/shared/SelectField'

import { useUser } from 'context/User'
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
		data: { currentUser },
	} = useUser()
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
		if (!currentUser) return
		setNewStudent({
			...currentUser,
			first_name: formData.firstName,
			last_name: formData.lastName,
			group_id: formData.group,
			role: 'student',
		})
		updateGroupListField({
			value: [currentUser.id],
			groupId: formData.group,
			listName: 'students',
		})
		return
	}

	function createNewTeacher(formData: TCreateAccountFD): void {
		if (!currentUser) return
		setNewTeacher({
			...currentUser,
			first_name: formData.firstName,
			last_name: formData.lastName,
			department_id: formData.department,
			role: 'teacher',
		})
		updateDepartmentListField({
			value: [currentUser.id],
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
				label={`Ім'я`}
				placeholder={`Введіть своє ім'я`}
				rules={{
					required: `Це поле є обов'язковим`,
				}}
			/>
			<TextField
				type='text'
				name='lastName'
				control={control}
				label='Прізвище'
				placeholder='Введіть своє прізвище'
				rules={{
					required: `Це поле є обов'язковим`,
				}}
			/>
			<SelectField
				name='faculty'
				control={control}
				options={facultiesOptions}
				label='Факультет'
				placeholder='Виберіть свій факультет'
				rules={{
					required: `Ви повинні вибрати варіант`,
				}}
			/>
			<SelectField
				name='department'
				control={control}
				options={selectDepartmentsOptionsBy({ faculies: [selectedFaculty] })}
				disabled={!selectedFaculty}
				label='Кафедра'
				placeholder='Виберіть свою кафедру'
				rules={{
					required: `Ви повинні вибрати варіант`,
				}}
			/>
			<SelectField
				name='role'
				control={control}
				options={userRole}
				label='Хто ви?'
				placeholder='Виберіть'
				rules={{
					required: `Ви повинні вибрати варіант`,
				}}
			/>
			{selectedRole === 'student' && (
				<SelectField
					name='group'
					control={control}
					options={selectGroupsOptionsBy({ departments: [selectedDepartmet] })}
					disabled={!watch('faculty')}
					label='Група'
					placeholder='Виберіть свою групу'
					rules={{
						required: `Ви повинні вибрати варіант`,
					}}
				/>
			)}
			<Button
				primary
				type='submit'
				disabled={!isValid}
			>
				Створити
			</Button>
		</Form>
	)
}

export default CreateAccountForm
