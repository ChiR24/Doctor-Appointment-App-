"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Welcome to the Rakshaya Doctor Appointment API!');
});
let doctors = [
    {
        id: 1,
        name: 'Dr. John Doe',
        specialty: 'Cardiologist',
        availability: 'available',
        timeSlots: [
            { time: '10:00 AM', isBooked: false },
            { time: '11:00 AM', isBooked: false },
            { time: '12:00 PM', isBooked: true },
        ],
    },
    {
        id: 2,
        name: 'Dr. Jane Smith',
        specialty: 'Dermatologist',
        availability: 'available',
        timeSlots: [
            { time: '09:00 AM', isBooked: false },
            { time: '09:30 AM', isBooked: false },
            { time: '10:00 AM', isBooked: false },
        ],
    },
];
app.get('/doctors', (req, res) => {
    res.json(doctors.map((_a) => {
        var { timeSlots } = _a, doctor = __rest(_a, ["timeSlots"]);
        return doctor;
    }));
});
app.get('/doctors/:id/slots', (req, res) => {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id, 10));
    if (doctor) {
        res.json(doctor.timeSlots);
    }
    else {
        res.status(404).send('Doctor not found');
    }
});
app.post('/book', (req, res) => {
    const { doctorId, time } = req.body;
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
    }
    const timeSlot = doctor.timeSlots.find(slot => slot.time === time);
    if (!timeSlot) {
        return res.status(404).json({ message: 'Time slot not found' });
    }
    if (timeSlot.isBooked) {
        return res.status(400).json({ message: 'Time slot is already booked' });
    }
    timeSlot.isBooked = true;
    if (doctor.timeSlots.every(slot => slot.isBooked)) {
        doctor.availability = 'unavailable';
    }
    res.status(200).json({ message: 'Booking successful', booking: { doctorId, time } });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
