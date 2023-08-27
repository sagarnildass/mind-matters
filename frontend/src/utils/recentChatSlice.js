import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecentChat = createAsyncThunk(
    'recentChat/fetchRecentChat',
    async (token) => {
        const response = await axios.get('http://127.0.0.1:8000/views/recent_chat_summary/', {
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
