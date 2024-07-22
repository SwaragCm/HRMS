import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteEmployee } from '../api/deleteEmployee';

export const deleteEmployeeData = createAsyncThunk(
  'employeeDelete/deleteEmployee',
  async (employeeId) => {
    const response = await deleteEmployee(employeeId);
    return response;
  }
);

const employeeDeleteSlice = createSlice({
  name: 'employeeDelete',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteEmployeeData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteEmployeeData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteEmployeeData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default employeeDeleteSlice.reducer;
