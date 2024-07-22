import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getEmployees } from "../api/listEmployees";

const initialState = {
  employees: [],
  status: 'idle',
  error: null
};

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async () => {
    const response = await getEmployees();
    console.log(response,"response from store");
    return response;
  }
);

const employeeListSlice = createSlice({
  name: 'employeeList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default employeeListSlice.reducer;
