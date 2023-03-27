import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from 'redux/store'

interface IActiveSessionState {
	value: number
}

const initialState: IActiveSessionState = {
	value: 0,
}

export const activeSessionSlise = createSlice({
	name: 'activeSession',
	initialState: initialState,
	reducers: {
		init: (state, action: PayloadAction<number>) => {
			state.value = action.payload
		},
	},
})

export const { init } = activeSessionSlise.actions

export default activeSessionSlise.reducer
