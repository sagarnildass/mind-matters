// src/utils/emotionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL

export const fetchEmotionData = createAsyncThunk('emotion/fetchEmotionData', async (token) => {
  const response = await axios.get(`${API_URL}/views/sentiment_scores/`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
});

const emotionSlice = createSlice({
  name: 'emotion',
  initialState: { data: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmotionData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmotionData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchEmotionData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default emotionSlice.reducer;

export const selectEmotionData = (state) => state.emotion.data;
