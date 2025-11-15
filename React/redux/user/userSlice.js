import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
        saveUser: (state, action) => {
            state.currentUser = action.payload
        },
        adminLogout: (state) => {
            state.currentUser = null
        }
  }
})

export const { saveUser, adminLogout } = userSlice.actions

export default userSlice.reducer