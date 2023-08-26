// src/utils/dailyMentalHealthSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDailyMentalHealth = createAsyncThunk('dailyMentalHealth/fetchDailyMentalHealth', async (token) => {
  const response = await axios.get('http://127.0.0.1:8000/views/daily_mental_health/', {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
});

const dailyMentalHealthSlice = createSlice({
  name: 'dailyMentalHealth',
  initialState: { data: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyMentalHealth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDailyMentalHealth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDailyMentalHealth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dailyMentalHealthSlice.reducer;

export const selectDailyMentalHealth = (state) => state.dailyMentalHealth.data;
