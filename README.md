# Rakshaya - Doctor Appointment App

This project is a submission for the Rakshaya Software Developer Internship assignment. It is a full-stack mobile application for booking doctor appointments, built with React Native (Expo) for the frontend and Node.js/Express for the backend.

## Features

- View a list of doctors with their specialty and availability.
- Book an appointment with a doctor by selecting an available time slot.
- View a list of your booked appointments.
- Real-time availability updates for doctors and time slots.

## Tech Stack

- **Frontend (Client):**
  - React Native (Expo)
  - TypeScript
  - Redux Toolkit for state management
  - Axios for API calls
  - Expo Router for navigation

- **Backend (Server):**
  - Node.js
  - Express
  - TypeScript
  - In-memory data store (no database)

## Project Structure

The project is organized as a monorepo with two main directories:

- `/client`: Contains the React Native (Expo) mobile application.
- `/server`: Contains the Node.js Express backend server.

## Setup and Running the Project

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Expo Go app on your mobile device (for testing the client)

### Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3001`.

### Frontend Setup

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your device:**
   - Scan the QR code with the Expo Go app (on Android or iOS).
   - Ensure your mobile device is connected to the same Wi-Fi network as your computer.

## Hosted Backend

The backend server is not yet hosted. To run the application, you must run the backend server locally as described in the setup instructions.

## Assumptions and Decisions

- **In-Memory Data:** The assignment stated that no database is required. Therefore, the backend uses a simple in-memory array to store doctor and booking data. This data will reset every time the server restarts.
- **State Management:** I chose Redux Toolkit for state management on the client-side as it provides a robust and scalable way to manage application state, especially for features like caching fetched data and managing booking status.
- **Local Bookings Storage:** The "My Bookings" screen currently displays bookings stored in the Redux state on the client. They are not persisted and will be lost if the app is closed. This could be extended to fetch from a backend endpoint.
- **No User Authentication:** As per the bonus points suggestion, user login is not implemented. Bookings are not tied to a specific user account.
- **UI/UX:** The UI is kept simple and functional to focus on the core requirements of the assignment. I used standard React Native components.
- **Build Status:** There is a known issue with the TypeScript and Express type configurations that prevents the server's production build (`npm run build`) from completing successfully. However, the application is fully functional in development mode (`npm run dev`), which is sufficient for demonstrating the assignment's requirements.
