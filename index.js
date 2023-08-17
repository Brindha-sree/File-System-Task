const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

let rooms = [ {
  id:1,
  seats:10,
  amenities: ['Projector', 'Whiteboard', 'Wi-Fi'],
  pricePerHour: 50,
},
  {
    id:2,
    seats:8,
    amenities: ['Projector', 'Whiteboard', 'Wi-Fi'],
    pricePerHour: 50,
  }
];

let bookings = [ {
  bookingId: 1,
    customerName: 'Brindha',
    roomName: 'Hall A',
    date: '2023-08-17',
    startTime: '14:00',
    endTime: '17:00',
    bookingDate: '2023-08-10',
    bookingStatus: 'Confirmed'
},
    {
      bookingId: 2,
    customerName: 'Rindha',
    roomName: 'Hall B',
    date: '2023-09-17',
    startTime: '13:00',
    endTime: '15:00',
    bookingDate: '2023-09-10',
    bookingStatus: 'Confirmed'
    }

  ];


//Get all rooms

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

//Get a specific room by Id

app.get('/rooms/:id' , (req, res) => {
  const roomId = parseInt(req.params.id);
  const room = rooms.find((room) => room.id === roomId);
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  res.json(room);
})

app.post('/rooms', (req, res) =>{
  const newRoom = req.body;
  newRoom.id = rooms.length + 1;
  rooms.push(newRoom);
  res.status(201).json(newRoom);
});

//Booking API
app.get('/bookings', (req, res) => {
  res.json(bookings);
});

app.get('/bookings/count/:customerName', (req, res) => {
  const customerName = req.params.customerName;
  const bookingCount = bookings.filter(booking => booking.customerName === customerName).length;
  res.json({ customerName, bookingCount });
});

//Customer API
app.get('/api/rooms', (req, res) => {
  const roomsWithBookings = rooms.map(room => {
    const bookedData = bookings.filter(booking => booking.roomId === room.id);
    return {
      ...room,
      bookings: bookedData,
    };
  });

  res.json(roomsWithBookings);
});

// Endpoint to create a booking
app.post('/api/bookings', (req, res) => {
  const { roomId, customer, bookingDate, startTime, endTime } = req.body;

  // Generate a simple booking ID (replace with a better ID generation method)
  const bookingId = bookings.length + 1;


  const newBooking = {
    bookingId,
    roomId,
    customer,
    bookingDate,
    startTime,
    endTime,
    status: 'booked',
    booked_On: new Date(),
  };

  bookings.push(newBooking);

  res.status(201).json(newBooking);
});



