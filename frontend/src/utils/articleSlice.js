// src/utils/articlesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_APP_API_URL

export const fetchRecommendedArticles = createAsyncThunk(
  'articles/fetchRecommendedArticles',
  async (token) => {
    const response = await axios.get(`${API_URL}/recommendation_articles/get_recommendations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

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
