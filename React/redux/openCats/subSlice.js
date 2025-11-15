import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentSub: null
}

export const subSlice = createSlice({
  name: 'sub',
  initialState,
  reducers: {
        saveSub: (state, action) => {
            state.currentSub = action.payload
        },
  }
})

export const { saveSub } = subSlice.actions

export default subSlice.reducer