import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWeeklySummary = createAsyncThunk('weeklySummary/fetchWeeklySummary', async (token) => {
  const response = await axios.get('https://mentalhealthapi.artelus.in/views/user_activity_summary_7d/', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
});

const weeklySummarySlice = createSlice({
  name: 'weeklySummary',
  initialState: { data: {}, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeeklySummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeeklySummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWeeklySummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default weeklySummarySlice.reducer;

export const selectWeeklySummary = (state) => state.weeklySummary.data;
