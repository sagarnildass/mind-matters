import { configureStore, getDefaultMiddleware, applyMiddleware } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import emotionReducer from './emotionSlice';
import articlesReducer from './articleSlice';
import dailyMentalHealthReducer from './dailyMentalHealthSlice';
import weeklySummaryReducer from './weeklySummarySlice'; // <-- Import the new slice
import recentChatReducer from './recentChatSlice';
import quoteReducer from './quoteSlice';

import tokenExpiryMiddleware from '../middleware/tokenExpiryMiddleware';

export const store = configureStore({
    reducer: {
        user: userReducer,
        emotion: emotionReducer,  // <-- Add the new slice to the store
        articles: articlesReducer,
        dailyMentalHealth: dailyMentalHealthReducer,
        weeklySummary: weeklySummaryReducer,
        recentChat: recentChatReducer,
        quote: quoteReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenExpiryMiddleware)
});