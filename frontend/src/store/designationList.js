import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDesignations } from "../api/listRoles";


const initialState = {
  designations: [],
  status: 'idle',
  error: null
};

export const fetchDesignations = createAsyncThunk(
  "designations/fetchAll",
  async () => {
    const response = await getDesignations();
    return response;
  }
);

const designationsListSlice = createSlice({
  name: 'designationsList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.designations = action.payload;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default designationsListSlice.reducer;
