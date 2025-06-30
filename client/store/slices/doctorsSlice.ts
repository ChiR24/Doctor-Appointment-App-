import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    availability: 'available' | 'unavailable';
}

interface DoctorsState {
    doctors: Doctor[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DoctorsState = {
    doctors: [],
    loading: 'idle',
    error: null,
};

export const fetchDoctors = createAsyncThunk('doctors/fetchDoctors', async () => {
    const response = await axios.get(`${API_BASE_URL}/doctors`);
    return response.data as Doctor[];
});

const doctorsSlice = createSlice({
    name: 'doctors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctors.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchDoctors.fulfilled, (state, action: PayloadAction<Doctor[]>) => {
                state.loading = 'succeeded';
                state.doctors = action.payload;
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.error.message || 'Failed to fetch doctors';
            });
    },
});

export default doctorsSlice.reducer; 