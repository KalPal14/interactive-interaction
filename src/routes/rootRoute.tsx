import { createBrowserRouter } from 'react-router-dom'

import HomePage from 'pages/HomePage'
import SignInPage from 'pages/SignInPage'
import SignUpPage from 'pages/SignUpPage'
import NotFoundPage from 'pages/NotFoundPage'
import CreateAccountPage from 'pages/CreateAccountPage'
import ProtectedPage from 'containers/ProtectedPage'
import CreateLecturePage from 'pages/CreateLecturePage'
import LecturePage from 'pages/LecturePage'
import SurveyPage from 'pages/SurveyPage'

const rootRouter = createBrowserRouter([
	{
		path: '*',
		element: <NotFoundPage />,
	},
	{
		path: '/',
		element: (
			<ProtectedPage accessFor='userWithAccount'>
				<HomePage />
			</ProtectedPage>
		),
	},
	{
		path: '/sign-in',
		element: (
			<ProtectedPage accessFor='guest'>
				<SignInPage />
			</ProtectedPage>
		),
	},
	{
		path: '/sign-up',
		element: (
			<ProtectedPage accessFor='guest'>
				<SignUpPage />
			</ProtectedPage>
		),
	},
	{
		path: 'create-account',
		element: (
			<ProtectedPage accessFor='userWithoutAccount'>
				<CreateAccountPage />
			</ProtectedPage>
		),
	},
	{
		path: 'create-lecture',
		element: (
			<ProtectedPage accessFor='teacher'>
				<CreateLecturePage />
			</ProtectedPage>
		),
	},
	{
		path: 'lecture/:id',
		element: (
			<ProtectedPage accessFor='userWithAccount'>
				<LecturePage />
			</ProtectedPage>
		),
	},
	{
		path: '/lecture/:lectureId/survey/:surveyId',
		element: (
			<ProtectedPage accessFor='userWithAccount'>
				<SurveyPage />
			</ProtectedPage>
		),
	},
])

export default rootRouter
