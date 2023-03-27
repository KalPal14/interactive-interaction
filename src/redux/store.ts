import { configureStore } from '@reduxjs/toolkit'

import activeSessionReduser from 'redux/slices/activeSession'

export const store = configureStore({
	reducer: {
		activeSession: activeSessionReduser,
	},
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch
