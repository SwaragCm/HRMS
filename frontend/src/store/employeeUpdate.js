import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updateEmployee } from '../api/editEmployee';

export const updateEmployeeData = createAsyncThunk(
  'employeeUpdate/updateEmployee',
  async ({ employeeId, data }) => {
    console.log(employeeId,data,"store employee update");
    const response = await updateEmployee(employeeId, data);
    console.log(employeeId,data,"store employee update");
    return response;
  }
);

const employeeUpdateSlice = createSlice({
  name: 'employeeUpdate',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateEmployeeData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateEmployeeData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateEmployeeData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default employeeUpdateSlice.reducer;