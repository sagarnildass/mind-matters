// similarUsersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching similar users
export const fetchSimilarUsers = createAsyncThunk(
    'similarUsers/fetchSimilarUsers',
    async (userId, { rejectWithValue }) => {
      const token = localStorage.getItem('access_token');  // Retrieve token from localStorage
      try {
        const response = await axios.get(`http://127.0.0.1:8000/recommendation_users/similar_users/${userId}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`  // Pass the token here
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

// Initial state
const initialState = {
  similarUsers: [],
  status: 'idle',
  error: null
};

// Slice
const similarUsersSlice = createSlice({
  name: 'similarUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSimilarUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSimilarUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.similarUsers = action.payload.similar_users;
      })
      .addCase(fetchSimilarUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Reducer
export default similarUsersSlice.reducer;

// Selectors
export const selectSimilarUsers = (state) => state.similarUsers.similarUsers;
export const selectSimilarUsersStatus = (state) => state.similarUsers.status;
export const selectSimilarUsersError = (state) => state.similarUsers.error;
