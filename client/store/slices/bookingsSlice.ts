import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Doctor } from './doctorsSlice';

export interface Booking {
    doctor: Doctor;
    time: string;
}

interface BookingsState {
    bookings: Booking[];
}

const initialState: BookingsState = {
    bookings: [],
};

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        addBooking: (state, action: PayloadAction<Booking>) => {
            state.bookings.push(action.payload);
        },
    },
});

export const { addBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer; 