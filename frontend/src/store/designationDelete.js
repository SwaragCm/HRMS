import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteDesignation } from '../api/deleteDesignation';

export const deleteDesignationData = createAsyncThunk(
  'designationDelete/deleteDesignation',
  async (designationId) => {
    const response = await deleteDesignation(designationId);
    return response;
  }
);

const designationDeleteSlice = createSlice({
  name: 'designationDelete',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteDesignationData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteDesignationData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteDesignationData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default designationDeleteSlice.reducer;
