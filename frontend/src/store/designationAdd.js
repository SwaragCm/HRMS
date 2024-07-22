import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postDesignation } from "../api/addRole";

const initialState = {
  designations: [],
  status: 'idle',
  error: null
};

export const addDesignation = createAsyncThunk(
  "designations/add",
  async ({ designationData, successCB, errorCB }) => {
    const response = await postDesignation(designationData, successCB, errorCB);
    return response?.data;
  }
);

const designationAddSlice = createSlice({
  name: 'designations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addDesignation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addDesignation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.designations.push(action.payload); 
      })
      .addCase(addDesignation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default designationAddSlice.reducer;
