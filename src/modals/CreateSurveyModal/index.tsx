import { useForm, useFieldArray } from 'react-hook-form'
import { Button, Modal, Form } from 'semantic-ui-react'
import { ThenableReference } from 'firebase/database'
import { useParams } from 'react-router-dom'

import TextField from 'components/shared/TextField'
import SelectField from 'components/shared/SelectField'

import { useDisclosure } from 'context/Disclosure'
import { useSurvey } from 'context/Survey'
import { useQuestion } from 'context/Question'
import { useLecture } from 'context/Lecture'

import { TId } from 'ts/types/shared'

import { questionFieldTypeOptions, trueFalseOptions } from 'helpers/selectOptions'

function CreateSurveyModal(): JSX.Element {
	const {
		handleSubmit,
		control,
		watch,
		reset,
		formState: { isValid },
	} = useForm<any>({
		mode: 'onBlur',
	})
	useFieldArray({
		control,
		name: 'questions',
	})
	useFieldArray({
		control,
		name: 'options',
	})
	const { id: lectureId } = useParams()

	const {
		data: { isOpen },
		actions: { onOpen, onClose },
	} = useDisclosure()
	const {
		actions: { createFutureSurveyRef, setNewSurvey },
	} = useSurvey()
	const {
		actions: { createFutureQuestionRef, setNewQuestion },
	} = useQuestion()
	const {
		actions: { updateLectureListField },
	} = useLecture()

	const selectedQuestionsAmount = watch('questionsAmount')
	const selectedIsTest = watch('isTest')

	function onSubmit(formData: any): void {
		const questions = formData.questions.slice(0, formData.questionsAmount)
		const newSurveyRef = createFutureSurveyRef()
		const newQuestionsRefs = createQuestionsRefs(questions).filter(({ key }) => key)
		const newQuestionsIds = newQuestionsRefs.map(({ key }) => key)

		if (
			!newSurveyRef.key ||
			!newQuestionsRefs.length ||
			newQuestionsRefs.length !== questions.length ||
			!lectureId
		) {
			return
		}

		setNewSurvey({
			ref: newSurveyRef,
			lecture_id: lectureId,
			created_at: new Date().toString(),
			is_test: formData.isTest === 'true' ? true : false,
			name: formData.name,
			questions: newQuestionsIds as TId[],
		})
		updateLectureListField({
			value: [newSurveyRef.key],
			lectureId,
			listName: 'surveis',
		})
		newQuestionsRefs.forEach((questionRef, index) => {
			const optionsAmount = questions[index].optionsAmount ?? 0
			const options = (questions[index].options ?? []).slice(0, optionsAmount)
			setNewQuestion({
				ref: questionRef,
				lecture_id: lectureId,
				survey_id: newSurveyRef.key!,
				field_type: questions[index].fieldType,
				label: questions[index].label ?? '',
				options: options ?? [],
				correct_answer: questions[index].correctAnswer ?? '',
			})
		})
		resetForm()
		onClose()
	}

	function createQuestionsRefs(questions: any[]): ThenableReference[] {
		return questions.map(() => {
			const newQuestionRef = createFutureQuestionRef()
			return newQuestionRef
		})
	}

	function resetForm(): void {
		reset({
			name: '',
			isTest: 'true',
			options: [],
			questions: [],
			questionsAmount: 1,
		})
	}

	function isShowQuestionOptionsFields(fieldTypeName: string): boolean {
		const selectedFieldType: string = watch(fieldTypeName)
		switch (selectedFieldType) {
			case 'select':
			case 'multiselect':
				return true
			default:
				return false
		}
	}

	function renderQuestionFields(questionIndex: number): JSX.Element {
		return (
			<div
				key={questionIndex}
				className='mb-3'
			>
				<TextField
					type='text'
					name={`questions.${questionIndex}.label`}
					label={`Питання №${questionIndex + 1}`}
					control={control}
					placeholder='Лейбл до питання'
					rules={{
						required: selectedQuestionsAmount > 1 ? `Це поле обов'язкове` : false,
					}}
				/>
				{selectedIsTest === 'true' && (
					<TextField
						type='text'
						name={`questions.${questionIndex}.correctAnswer`}
						control={control}
						placeholder='Правильна відповідь на питання'
						rules={{
							required: `Це поле обов'язкове`,
						}}
					/>
				)}
				<SelectField
					name={`questions.${questionIndex}.fieldType`}
					control={control}
					options={questionFieldTypeOptions}
					placeholder='Виберіть тип поля'
					rules={{
						required: 'You must select an option',
					}}
				/>
				{isShowQuestionOptionsFields(`questions.${questionIndex}.fieldType`) && (
					<div
						className='mb-3'
						style={{ paddingLeft: '3rem' }}
					>
						<TextField
							type='number'
							name={`questions.${questionIndex}.optionsAmount`}
							control={control}
							placeholder='Введіть кількість варіантів відповідей'
							rules={{
								required: `Це поле обов'язкове`,
								min: {
									value: 1,
									message: 'Не може бути менше одного',
								},
							}}
						/>
						{Array.from({ length: watch(`questions.${questionIndex}.optionsAmount`) }).map(
							(_, optionIndex) => (
								<TextField
									type='text'
									name={`questions.${questionIndex}.options.${optionIndex}`}
									control={control}
									placeholder={`Варіант відповіді №${optionIndex + 1}`}
									rules={{
										required: `Це поле обов'язкове`,
									}}
								/>
							),
						)}
					</div>
				)}
			</div>
		)
	}

	return (
		<>
			<Modal
				open={isOpen}
				onOpen={onOpen}
				trigger={
					<Button
						compact
						primary
					>
						Додати опитування
					</Button>
				}
				centered={false}
				size='small'
			>
				<Modal.Header>Створіть опитування</Modal.Header>
				<Modal.Content
					scrolling
					className='pb-3'
				>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Modal.Description className='pb-5 mb-5'>
							<TextField
								type='text'
								name='name'
								control={control}
								label='Назва'
								placeholder='Введіть назву опитування'
								rules={{
									required: `Це поле обов'язкове`,
								}}
							/>
							<SelectField
								name='isTest'
								control={control}
								options={trueFalseOptions}
								label='Це тестування з правильними варіантами відповідей?'
								defaultValue={trueFalseOptions[0].value}
								rules={{
									required: 'Ви повинні вибрати опцію',
								}}
							/>
							<TextField
								type='number'
								name='questionsAmount'
								control={control}
								label='Кількість питань'
								placeholder='Введіть кількість питань'
								defaultValue={1}
								rules={{
									required: `Це поле обов'язкове`,
									min: {
										value: 1,
										message: 'Не може бути менше одного',
									},
								}}
							/>
							{Array.from({ length: selectedQuestionsAmount }).map((_, index) =>
								renderQuestionFields(index),
							)}
						</Modal.Description>
						<Modal.Actions className='d-flex justify-content-end pt-5 mt-5'>
							<Button
								secondary
								onClick={(): void => {
									resetForm()
									onClose()
								}}
							>
								Відмінити
							</Button>
							<Button
								primary
								type='submit'
								disabled={!isValid}
							>
								Створити опитування
							</Button>
						</Modal.Actions>
					</Form>
				</Modal.Content>
			</Modal>
		</>
	)
}

export default CreateSurveyModal
