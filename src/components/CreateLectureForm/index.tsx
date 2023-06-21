import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button } from 'semantic-ui-react'
import dateFormat from 'dateformat'

import TextField from 'components/shared/TextField'
import SelectField from 'components/shared/SelectField'
import DateField from 'components/shared/DateField'

import { useGroup } from 'context/Group'
import { usePredmet } from 'context/Predmet'
import { useLecture } from 'context/Lecture'
import { useUser } from 'context/User'

import { TCreateLectureFD } from 'ts/types/formData'
import { useTeacher } from 'context/Teacher'
import { TId } from 'ts/types/shared'

function CreateLectureForm(): JSX.Element {
	const {
		handleSubmit,
		control,
		watch,
		trigger,
		reset,
		formState: { isValid },
	} = useForm<TCreateLectureFD>({
		mode: 'onBlur',
	})

	const {
		data: { currentUser },
	} = useUser()
	const {
		actions: { updateTeacherListField },
	} = useTeacher()
	const {
		actions: { updateGroupListField },
		selectors: { selectAllGroupsOptions },
	} = useGroup()
	const {
		actions: { setNewPredmet, createFuturePredmetRef, updatePredmetListField },
		selectors: { selectAllPredmetsOptions },
	} = usePredmet()
	const {
		actions: { setNewLecture, createFutureLectureRef },
	} = useLecture()

	const startDateValue = watch('startDate')
	const predmetValue = watch('predmet')
	const newPredmetValue = watch('newPredmet')
	const allPredmetsOptions = selectAllPredmetsOptions()
	const allPredmetsOptionsNames = allPredmetsOptions.map(({ text }) => text)

	useEffect(() => {
		if (startDateValue) {
			trigger('endDate')
		}
	}, [startDateValue, trigger])

	useEffect(() => {
		if (!predmetValue && !newPredmetValue) return
		trigger('predmet')
		trigger('newPredmet')
	}, [predmetValue, newPredmetValue, trigger])

	function onSubmit(formData: TCreateLectureFD): void {
		if (formData.newPredmet) {
			const { newLectureId, newPredmetId } = createLectureWithNewPredmet(formData)
			if (!newLectureId || !newPredmetId) return
			updateAfterLectureCreating(formData.groups, newLectureId, newPredmetId)
			resetForm()
			return
		}
		const newLectureId = createLectureWithExistingPredmet(formData)
		if (!newLectureId) return
		updateAfterLectureCreating(formData.groups, newLectureId, formData.predmet)
		resetForm()
	}

	function resetForm(): void {
		reset({
			name: '',
			predmet: '',
			newPredmet: '',
			groups: [],
			startDate: '',
			endDate: '',
		})
	}

	function createLectureWithNewPredmet(formData: TCreateLectureFD): {
		newLectureId: TId | null
		newPredmetId: TId | null
	} {
		const newPredmetRef = createFuturePredmetRef()
		const newLectureRef = createFutureLectureRef()
		if (!newLectureRef.key || !newPredmetRef.key || !currentUser) {
			return {
				newLectureId: null,
				newPredmetId: null,
			}
		}
		setNewPredmet({
			ref: newPredmetRef,
			lectures: [newLectureRef.key],
			name: formData.newPredmet,
		})
		setNewLecture({
			ref: newLectureRef,
			predmet_id: newPredmetRef.key,
			teacher_id: currentUser!.id,
			name: formData.name,
			start_date: formData.startDate,
			end_date: formData.endDate,
			groups: formData.groups,
		})
		return {
			newLectureId: newLectureRef.key,
			newPredmetId: newPredmetRef.key,
		}
	}

	function createLectureWithExistingPredmet(formData: TCreateLectureFD): TId | null {
		const newLectureRef = createFutureLectureRef()
		if (!newLectureRef.key || !currentUser) {
			return null
		}
		setNewLecture({
			ref: newLectureRef,
			predmet_id: formData.predmet,
			teacher_id: currentUser!.id,
			name: formData.name,
			start_date: formData.startDate,
			end_date: formData.endDate,
			groups: formData.groups,
		})
		updatePredmetListField({
			value: [newLectureRef.key],
			predmetId: formData.predmet,
			listName: 'lectures',
		})
		return newLectureRef.key
	}

	function updateAfterLectureCreating(groups: TId[], lectureId: TId, predmetId: TId): void {
		groups.forEach((groupId) => {
			updateGroupListField({
				groupId,
				value: [lectureId],
				listName: 'lectures',
			})
			updateGroupListField({
				groupId,
				value: [predmetId],
				listName: 'predmets',
			})
		})
		updateTeacherListField({
			value: [lectureId],
			teacherId: currentUser!.id,
			listName: 'lectures',
		})
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<TextField
				type='text'
				name='name'
				control={control}
				label='Назва'
				placeholder='Введіть назву лекції'
				rules={{
					required: `Це поле обов'язкове`,
				}}
			/>
			<SelectField
				name='predmet'
				control={control}
				options={allPredmetsOptions}
				label='Предмет'
				placeholder='Виберіть вже існуючий предмет'
				rules={{
					required: newPredmetValue ? false : 'Виберіть вже існуючий предмет чи створіть новий',
					validate: {
						'Заповніть лише одне поле предмета': (): boolean => {
							return predmetValue && newPredmetValue ? false : true
						},
					},
				}}
				clearable={true}
			/>
			<TextField
				type='text'
				name='newPredmet'
				control={control}
				placeholder='Чи створіть новий'
				rules={{
					required: predmetValue ? false : 'Виберіть вже існуючий предмет чи створіть новий',
					validate: {
						'Заповніть лише одне поле предмета': (): boolean => {
							return predmetValue && newPredmetValue ? false : true
						},
						'Предмет з такою назвою вже існує. Виберіть його зі списку існуючих предметів': (
							value,
						): boolean => {
							return !allPredmetsOptionsNames.includes(String(value))
						},
					},
				}}
			/>
			<SelectField
				name='groups'
				multiple={true}
				control={control}
				options={selectAllGroupsOptions()}
				label='Группа'
				placeholder='Виберіть группу'
				rules={{
					required: `Ви повинні вибрати варіант`,
				}}
			/>
			<DateField
				type='datetime-local'
				name='startDate'
				control={control}
				label='Початок лекції'
				placeholder='Вкажіть дату та час початку лекції'
				rules={{
					required: `Це поле обов'язкове`,
					validate: {
						'Не можна обирати минулу дату': (selectedDate): boolean => {
							const today = new Date()
							return new Date(String(selectedDate)) > today
						},
					},
				}}
			/>
			<DateField
				disabled={!startDateValue}
				type='datetime-local'
				name='endDate'
				control={control}
				label='Завершення лекції'
				placeholder='Вкажіть дату та час завершення лекції'
				rules={{
					required: `Це поле обов'язкове`,
					validate: {
						'Вкажіть дату новішу за дату початку лекції': (selectedDate): boolean => {
							return new Date(String(selectedDate)) > new Date(startDateValue)
						},
						'Лекція повинна закінчуватись в один день з її початком': (selectedDate): boolean => {
							const selectedDateWithoutTime = dateFormat(
								new Date(String(selectedDate)),
								'yyyy-mm-dd',
							)
							const startDateWithoutTime = dateFormat(new Date(startDateValue), 'yyyy-mm-dd')
							return selectedDateWithoutTime === startDateWithoutTime
						},
					},
				}}
			/>
			<div className='d-flex justify-content-end'>
				<Button
					primary
					type='submit'
					disabled={!isValid}
				>
					Створити лекцію
				</Button>
			</div>
		</Form>
	)
}

export default CreateLectureForm
