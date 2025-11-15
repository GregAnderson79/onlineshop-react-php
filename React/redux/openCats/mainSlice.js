import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentMain: null
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
        saveMain: (state, action) => {
            state.currentMain = action.payload
        },
  }
})

export const { saveMain } = mainSlice.actions

export default mainSlice.reducer