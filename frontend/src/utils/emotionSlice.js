// src/utils/emotionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEmotionData = createAsyncThunk('emotion/fetchEmotionData', async (token) => {
  const response = await axios.get('http://127.0.0.1:8000/views/sentiment_scores/', {
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
