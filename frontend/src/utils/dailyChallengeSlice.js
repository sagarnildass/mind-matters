// utils/dailyChallengeSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDailyChallenge = createAsyncThunk(
    'dailyChallenge/fetchDailyChallenge',
    async () => {
        const response = await axios.get('http://127.0.0.1:8000/views/daily_challenge/');  // Adjust the endpoint if needed
        return response.data;
        
    }
);

const dailyChallengeSlice = createSlice({
    name: 'dailyChallenge',
    initialState: { 
        challenge_id: null, 
        challenge_name: '', 
        challenge_description: '', 
        image_url: '',
        category: '',
        date_added: '',
        status: 'idle', 
        error: null 
    },
    reducers: {},
    extraReducers: {
        [fetchDailyChallenge.pending]: (state, action) => {
            state.status = 'loading';
        },
        [fetchDailyChallenge.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.challenge_id = action.payload.challenge_id;
            state.challenge_name = action.payload.challenge_name;
            state.challenge_description = action.payload.challenge_description;
            state.image_url = action.payload.image_url;
            state.category = action.payload.category;
            state.date_added = action.payload.date_added;
        },
        [fetchDailyChallenge.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    }
});

export const selectDailyChallenge = state => state.dailyChallenge;

export default dailyChallengeSlice.reducer;
