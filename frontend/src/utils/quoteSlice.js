// utils/quoteSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRandomQuote = createAsyncThunk(
    'quote/fetchRandomQuote',
    async () => {
        const response = await axios.get('https://mentalhealthapi.artelus.in/views/random_quote/');  // Adjust the endpoint if needed
        return response.data;
    }
);

const quoteSlice = createSlice({
    name: 'quote',
    initialState: { quote: '', author: '', status: 'idle', error: null },
    reducers: {},
    extraReducers: {
        [fetchRandomQuote.pending]: (state, action) => {
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
