import { createBrowserRouter } from 'react-router-dom'

import HomePage from 'pages/HomePage'
import SignInPage from 'pages/SignInPage'
import SignUpPage from 'pages/SignUpPage'
import NotFoundPage from 'pages/NotFoundPage'

const rootRouter = createBrowserRouter([
	{
		path: '*',
		element: <NotFoundPage />,
	},
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/sign-in',
		element: <SignInPage />,
	},
	{
		path: '/sign-up',
		element: <SignUpPage />,
	},
])

export default rootRouter
