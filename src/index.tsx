import React from 'react'
import ReactDOM from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'

import App from './App'

import './firebase'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
