import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchEmergencyContacts = createAsyncThunk('emergencyContact/fetchEmergencyContacts', async (token) => {
  const response = await axios.get(`${API_URL}/views/get_emergency_contacts/`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
});

export const createEmergencyContact = createAsyncThunk('emergencyContact/createEmergencyContact', async (contact, { getState }) => {
  const { token } = getState().user;
  const response = await axios.post(`${API_URL}/views/create_emergency_contact/`, contact, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
});

const emergencyContactSlice = createSlice({
  name: 'emergencyContact',
  initialState: { data: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencyContacts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmergencyContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchEmergencyContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createEmergencyContact.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

export default emergencyContactSlice.reducer;

export const selectEmergencyContacts = (state) => state.emergencyContact.data;
