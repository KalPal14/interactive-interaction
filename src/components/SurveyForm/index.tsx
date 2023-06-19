import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { Form, Button } from 'semantic-ui-react'

import TextField from 'components/shared/TextField'
import SelectField from 'components/shared/SelectField'

import { useLecture } from 'context/Lecture'
import { useSurvey } from 'context/Survey'
import { useQuestion } from 'context/Question'
import { useUser } from 'context/User'
import { useAnswer } from 'context/Answers'

import { TQuestion, TQuestionsList } from 'ts/types/question'
import { TSelectOptionsList } from 'ts/types/inputFields'
import { TId } from 'ts/types/shared'
import { TAnswersList } from 'ts/types/answer'

function SurveyForm(): JSX.Element {
	const formSubmissionCounter = useRef(0)
	const { surveyId } = useParams()
	const {
		handleSubmit,
		control,
		formState: { isValid },
		setValue,
	} = useForm<any>({
		mode: 'onBlur',
	})
	useFieldArray({
		control,
		name: 'answers',
	})

	const {
		data: { lectures },
	} = useLecture()
	const {
		data: { currentUser },
	} = useUser()
	const {
		data: { surveys },
	} = useSurvey()
	const {
		data: { questions },
		actions: { updateQuestionListField },
	} = useQuestion()
	const {
		data: { answers },
		actions: { createFutureAnswerRef, setNewAnswer },
	} = useAnswer()

	const currentSurvey = surveys[surveyId!]
	if (!currentSurvey) return <></>
	const currentLecture = lectures[currentSurvey.lecture_id]
	const answersList: TAnswersList = Object.values(answers)
	const questionsList = getQuestionsList()

	function getQuestionsList(): TQuestionsList {
		if (!currentSurvey) return []
		return (
			currentSurvey.questions
				.map((questionId) => questions[questionId])
				.filter((question) => question) ?? []
		)
	}

	function onSubmit(formData: any): void {
		formData.answers.forEach((answerObj: { [key: TId]: string }) => {
			const questionId = Object.keys(answerObj)[0]
			const answer = answerObj[questionId]

			const newAnswerRef = createFutureAnswerRef()

			if (!newAnswerRef.key || !currentUser) return

			setNewAnswer({
				ref: newAnswerRef,
				user_id: currentUser.id,
				question_id: questionId,
				answer,
			})
			updateQuestionListField({
				value: [newAnswerRef.key],
				questionId,
				listName: 'answers',
			})
		})
		formSubmissionCounter.current++
		resetForm()
	}

	function resetForm(): void {
		questionsList.forEach((question, index) => {
			setValue(`answers.${index}.${question.id}`, '')
		})
	}

	function getFormatedOptions(options: string[]): TSelectOptionsList {
		return options.map((option) => ({
			key: option,
			value: option,
			text: option,
		}))
	}

	function renderField(question: TQuestion, index: number): JSX.Element {
		const questionId = question.id.toString()

		const thisUserAnswer = answersList.find(
			({ question_id, user_id }) => questionId === question_id && currentUser?.id === user_id,
		)
		const isDisabled = currentSurvey && currentSurvey.is_test && Boolean(thisUserAnswer)
		switch (question.field_type) {
			case 'text':
				return (
					<TextField
						type='text'
						name={`answers.${index}.${questionId}`}
						control={control}
						label={question.label ?? ''}
						placeholder='Введіть відповідь'
						rules={{
							required: currentUser?.role === 'teacher' ? false : `Це поле є обов'язковим`,
						}}
						disabled={isDisabled}
					/>
				)
			case 'select':
				return (
					<SelectField
						name={`answers.${index}.${questionId}`}
						control={control}
						options={getFormatedOptions(question.options!)}
						label={question.label ?? ''}
						placeholder='Виберіть один варіант'
						rules={{
							required: currentUser?.role === 'teacher' ? false : `Це поле є обов'язковим`,
						}}
						disabled={isDisabled}
					/>
				)
			case 'multiselect':
				return (
					<SelectField
						multiple={true}
						name={`answers.${index}.${questionId}`}
						control={control}
						options={getFormatedOptions(question.options!)}
						label={question.label ?? ''}
						placeholder='виберіть один чи декілька варіантів'
						rules={{
							required: currentUser?.role === 'teacher' ? false : `Це поле є обов'язковим`,
						}}
						disabled={isDisabled}
					/>
				)
			default:
				return <></>
		}
	}

	function isNeedShowSubmitBtn(): boolean {
		if (!currentSurvey) {
			return false
		}
		if (currentSurvey.is_test && formSubmissionCounter.current >= 1) {
			return false
		}
		if (currentUser?.role === 'teacher') {
			return false
		}
		if (new Date(currentLecture.end_date) < new Date()) {
			return false
		}
		return true
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			{questionsList.map((question, index) => renderField(question, index))}
			{isNeedShowSubmitBtn() && (
				<Button
					primary
					type='submit'
					disabled={!isValid}
				>
					Відповісти
				</Button>
			)}
		</Form>
	)
}

export default SurveyForm
