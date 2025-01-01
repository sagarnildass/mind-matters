// utils/quoteSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchRandomQuote = createAsyncThunk(
    'quote/fetchRandomQuote',
    async () => {
        const response = await axios.get(`${API_URL}/views/random_quote/`);  // Adjust the endpoint if needed
        return response.data;
    }
);

const quoteSlice = createSlice({
    name: 'quote',
    initialState: { quote: '', author: '', status: 'idle', error: null },
    reducers: {},
    extraReducers: {
        [fetchRandomQuote.pending]: (state) => {
            state.status = 'loading';
        },
        [fetchRandomQuote.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.quote = action.payload.quote;
            state.author = action.payload.author;
        },
        [fetchRandomQuote.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    }
});

export const selectRandomQuote = state => state.quote;

export default quoteSlice.reducer;
