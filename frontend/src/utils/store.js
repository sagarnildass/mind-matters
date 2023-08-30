import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import emotionReducer from './emotionSlice';
import articlesReducer from './articleSlice';
import dailyMentalHealthReducer from './dailyMentalHealthSlice';
import weeklySummaryReducer from './weeklySummarySlice';
import recentChatReducer from './recentChatSlice';
import quoteReducer from './quoteSlice';
import dailyChallengeReducer from './dailyChallengeSlice'; // <-- Import the new slice

import tokenExpiryMiddleware from '../middleware/tokenExpiryMiddleware';

export const store = configureStore({
    reducer: {
        user: userReducer,
        emotion: emotionReducer,
        articles: articlesReducer,
        dailyMentalHealth: dailyMentalHealthReducer,
        weeklySummary: weeklySummaryReducer,
        recentChat: recentChatReducer,
        quote: quoteReducer,
        dailyChallenge: dailyChallengeReducer  // <-- Add the new slice to the store
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenExpiryMiddleware)
});
