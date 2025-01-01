import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchWeeklySummary = createAsyncThunk('weeklySummary/fetchWeeklySummary', async (token) => {
  const response = await axios.get(`${API_URL}/views/user_activity_summary_7d/`, {
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
