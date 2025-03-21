import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Interface for the flight search input
interface FlightSearchInput {
  destination: string;
  earliest_departure_date: string;
  latest_departure_date: string;
  num_adult_passengers: number;
  origin: string;
}

// Interface for the flight details
interface Flight {
  flight_number: string;
  origin: string;
  destination: string;
  departure_datetime: string;
  arrival_datetime: string;
  price: number;
  airline: string;
  available_seats: number;
}

// Simulated database
const flightsData = [
  {
    flight_number: 'UA101',
    origin: 'New York',
    destination: 'Las Vegas',
    departure_datetime: '2024-06-01T08:00:00Z',
    arrival_datetime: '2024-06-01T10:00:00Z',
    price: 250,
    airline: 'United Airlines',
    available_seats: 10,
  },
  {
    flight_number: 'AA202',
    origin: 'New York',
    destination: 'Las Vegas',
    departure_datetime: '2024-06-01T14:00:00Z',
    arrival_datetime: '2024-06-01T16:00:00Z',
    price: 280,
    airline: 'American Airlines',
    available_seats: 5,
  },
  {
    flight_number: 'DL303',
    origin: 'New York',
    destination: 'Las Vegas',
    departure_datetime: '2024-06-03T10:00:00Z',
    arrival_datetime: '2024-06-03T12:00:00Z',
    price: 260,
    airline: 'Delta Airlines',
    available_seats: 12,
  },
  {
    flight_number: 'SW404',
    origin: 'New York',
    destination: 'Las Vegas',
    departure_datetime: '2024-06-05T16:00:00Z',
    arrival_datetime: '2024-06-05T18:00:00Z',
    price: 220,
    airline: 'Southwest Airlines',
    available_seats: 20,
  },
  {
    flight_number: 'UA102',
    origin: 'Las Vegas',
    destination: 'New York',
    departure_datetime: '2024-06-08T09:00:00Z',
    arrival_datetime: '2024-06-08T17:00:00Z',
    price: 240,
    airline: 'United Airlines',
    available_seats: 8,
  },
];

const flightsDatabase: Flight[] = flightsData;

app.post('/search_flights', async (req: any, res: any, next: NextFunction) => {
  try {
    const searchParams: FlightSearchInput = req.body;

    if (
      !searchParams ||
      !searchParams.destination ||
      !searchParams.earliest_departure_date ||
      !searchParams.latest_departure_date ||
      !searchParams.num_adult_passengers ||
      !searchParams.origin
    ) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required search parameters',
      });
    }

    console.log('Received flight search request:', searchParams);

    // --- Simple filtering logic (can be expanded) ---
    const earliestDate = new Date(searchParams.earliest_departure_date + 'T00:00:00Z');
    const latestDate = new Date(searchParams.latest_departure_date + 'T23:59:59Z');

    const filteredFlights = flightsDatabase.filter((flight: Flight) => {
      const departureDate = new Date(flight.departure_datetime);
      return (
        flight.origin === searchParams.origin &&
        flight.destination === searchParams.destination &&
        departureDate >= earliestDate &&
        departureDate <= latestDate &&
        flight.available_seats >= searchParams.num_adult_passengers
      );
    });
    // --- End simple filtering logic ---

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Flights found',
      flights: filteredFlights,
    });
  } catch (error) {
    console.error('Error processing flight search:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to process flight search',
    });
  }
});

// For DialogFlow integration, we need a specific endpoint
app.post('/dialogflow/search_flights', async (req: any, res: any, next: NextFunction) => {
  try {
    const sessionId = req.query.sessionId;
    const turnId = req.query.turnId;
    const sequenceId = req.query.sequenceId;

    if (!sessionId || !turnId || !sequenceId) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing sessionId, turnId, or sequenceId in query parameters for DialogFlow integration.',
      });
    }

    console.log(`DialogFlow Request - SessionId: ${sessionId}, TurnId: ${turnId}, SequenceId: ${sequenceId}`);

    // Assuming the flight search parameters are directly in the body
    const searchParams: FlightSearchInput = req.body;

    if (
      !searchParams ||
      !searchParams.destination ||
      !searchParams.earliest_departure_date ||
      !searchParams.latest_departure_date ||
      !searchParams.num_adult_passengers ||
      !searchParams.origin
    ) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required search parameters',
      });
    }

    console.log('Received flight search request from DialogFlow:', searchParams);

    // --- Simple filtering logic ---
    const earliestDate = new Date(searchParams.earliest_departure_date + 'T00:00:00Z');
    const latestDate = new Date(searchParams.latest_departure_date + 'T23:59:59Z');

    const filteredFlights = flightsDatabase.filter((flight: Flight) => {
      const departureDate = new Date(flight.departure_datetime);
      return (
        flight.origin === searchParams.origin &&
        flight.destination === searchParams.destination &&
        departureDate >= earliestDate &&
        departureDate <= latestDate &&
        flight.available_seats >= searchParams.num_adult_passengers
      );
    });
    // --- End simple filtering logic ---

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Flights found',
      flights: filteredFlights.map((flight: Flight) => ({
        flight_number: flight.flight_number,
        origin: flight.origin,
        destination: flight.destination,
        departure_datetime: flight.departure_datetime,
        arrival_datetime: flight.arrival_datetime,
        price: flight.price,
        airline: flight.airline,
        available_seats: flight.available_seats,
      })),
    });
  } catch (error) {
    console.error('Error processing DialogFlow flight search:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to process flight search',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});