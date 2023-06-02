import React from 'react'
import ReactDOM from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'

import './firebase'
import './main.scss'

import App from 'App'

import { AuthProvider } from 'context/Auth'
import { DisclosureProvider } from 'context/Disclosure'
import { FacultyProvider } from 'context/Faculty'
import { DepartmentProvider } from 'context/Department'
import { GroupProvider } from 'context/Group'
import { TeacherProvider } from 'context/Teacher'
import { StudentProvider } from 'context/Student'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<React.StrictMode>
		<AuthProvider>
			<DisclosureProvider>
				<FacultyProvider>
					<DepartmentProvider>
						<GroupProvider>
							<TeacherProvider>
								<StudentProvider>
									<App />
								</StudentProvider>
							</TeacherProvider>
						</GroupProvider>
					</DepartmentProvider>
				</FacultyProvider>
			</DisclosureProvider>
		</AuthProvider>
	</React.StrictMode>,
)
