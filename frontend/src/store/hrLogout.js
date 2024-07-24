import { createSlice } from '@reduxjs/toolkit';
import logoutAPI from '../api/logout'; 

const initialState = {
  loggingOut: false,
  error: null,
};

const logoutSlice = createSlice({
  name: 'logout',
  initialState,
  reducers: {
    logoutStart(state) {
      state.loggingOut = true;
      state.error = null;
    },
    logoutSuccess(state) {
      state.loggingOut = false;
      state.error = null;
    },
    logoutFailure(state, action) {
      state.loggingOut = false;
      state.error = action.payload.error;
    },
  },
});

export const { logoutStart, logoutSuccess, logoutFailure } = logoutSlice.actions;

export const logoutUser = () => async (dispatch) => {
  dispatch(logoutStart());
  try {
    await logoutAPI(); 
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFailure({ error: error.message || 'Logout failed.' }));
  }
};

export default logoutSlice.reducer;
