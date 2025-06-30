import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Rakshaya Doctor Appointment API!');
});

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  availability: 'available' | 'unavailable';
  timeSlots: TimeSlot[];
}

interface TimeSlot {
  time: string;
  isBooked: boolean;
}

let doctors: Doctor[] = [
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

app.get('/doctors', (req: Request, res: Response) => {
  res.json(doctors.map(({ timeSlots, ...doctor }) => doctor));
});

app.get('/doctors/:id/slots', (req: Request, res: Response) => {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id, 10));
    if (doctor) {
        res.json(doctor.timeSlots);
    } else {
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