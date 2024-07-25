import { createSlice } from '@reduxjs/toolkit';
import loginAPI from '../api/login';

const initialState = {
  username: '',
  loggedIn: false,
  error: null,
};

const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.error = null;
    },
    loginSuccess(state, action) {
      state.username = action.payload.username;
      state.loggedIn = true;
      state.error = null;
    },
    loginFailure(state, action) {
      state.error = action.payload.error;
      state.loggedIn = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure } = loginSlice.actions;

export const loginUser = (username, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await loginAPI(username, password);
    dispatch(loginSuccess({ username: username }));
    return response; 
  } catch (error) {
    dispatch(loginFailure({ error: error.message || 'Login failed.' }));
    throw error; 
  }
};

export default loginSlice.reducer;

