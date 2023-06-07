import React from 'react'
import ReactDOM from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'

import './firebase'
import './main.scss'

import App from 'App'

import { UserProvider } from 'context/User'
import { DisclosureProvider } from 'context/Disclosure'
import { FacultyProvider } from 'context/Faculty'
import { DepartmentProvider } from 'context/Department'
import { GroupProvider } from 'context/Group'
import { TeacherProvider } from 'context/Teacher'
import { StudentProvider } from 'context/Student'
import { PredmetProvider } from 'context/Predmet'
import { LectureProvider } from 'context/Lecture'
import { SurveyProvider } from 'context/Survey'
import { QuestionProvider } from 'context/Question'
import { AnswerProvider } from 'context/Answers'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<React.StrictMode>
		<DisclosureProvider>
			<FacultyProvider>
				<DepartmentProvider>
					<GroupProvider>
						<TeacherProvider>
							<StudentProvider>
								<UserProvider>
									<PredmetProvider>
										<LectureProvider>
											<SurveyProvider>
												<QuestionProvider>
													<AnswerProvider>
														<App />
													</AnswerProvider>
												</QuestionProvider>
											</SurveyProvider>
										</LectureProvider>
									</PredmetProvider>
								</UserProvider>
							</StudentProvider>
						</TeacherProvider>
					</GroupProvider>
				</DepartmentProvider>
			</FacultyProvider>
		</DisclosureProvider>
	</React.StrictMode>,
)
