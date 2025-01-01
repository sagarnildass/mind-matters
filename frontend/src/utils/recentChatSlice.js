import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchRecentChat = createAsyncThunk(
    'recentChat/fetchRecentChat',
    async (token) => {
        const response = await axios.get(`${API_URL}/views/recent_chat_summary/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        // console.log('response', response.data)
        return response.data;
    }
);

export const recentChatSlice = createSlice({
    name: 'recentChat',
    initialState: [],
    reducers: {},
    extraReducers: {
        [fetchRecentChat.fulfilled]: (state, action) => {
            return action.payload;
        }
    }
});

export const selectRecentChat = state => state.recentChat;

export default recentChatSlice.reducer;
