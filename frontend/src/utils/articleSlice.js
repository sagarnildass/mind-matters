// src/utils/articlesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecommendedArticles = createAsyncThunk('articles/fetchRecommendedArticles', async () => {
  const response = await axios.get('http://127.0.0.1:8000/views/recommended_articles/', {
    headers: {
      'accept': 'application/json',
    }
  });
  return response.data;
});

const articlesSlice = createSlice({
  name: 'articles',
  initialState: { data: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecommendedArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchRecommendedArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default articlesSlice.reducer;

export const selectRecommendedArticles = (state) => state.articles.data;
