import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addEmployee } from "../api/addEmployee";

const initialState = {
  status: 'idle',
  error: null
};

export const createEmployee = createAsyncThunk(
  "employee/create",
  async ({ employeeData, successCB, errorCB }) => {
    const response = await addEmployee(employeeData, successCB, errorCB);
    return response;  
  }
);

const employeeAddSlice = createSlice({
  name: 'employeeAdd',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default employeeAddSlice.reducer;


