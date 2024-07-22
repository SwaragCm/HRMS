import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updateDesignation } from '../api/editRole';

export const updateDesignationData = createAsyncThunk(
  'designationEdit/updateDesignation',
  async ({ designationId, data }) => {
    const response = await updateDesignation(designationId, data);
    return response;
  }
);

const designationEditSlice = createSlice({
  name: 'designationEdit',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateDesignationData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateDesignationData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateDesignationData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default designationEditSlice.reducer;
