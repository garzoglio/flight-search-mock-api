# Flight Search Mock API

This is a simple API that mocks the search of flights. It provides a basic interface for testing flight search functionalities without connecting to a real flight booking system.

## API Interface

This API exposes the following endpoint:

### `POST /dialogflow/search_flights`

Simulates a flight search based on the provided criteria.

**Request Body:**

```json
{
  "origin": "string",                      // Departure location (e.g., "New York")
  "destination": "string",                 // Arrival location (e.g., "Las Vegas")
  "earliest_departure_date": "YYYY-MM-DD", // Earliest departure date (e.g., "2024-06-01")
  "latest_departure_date": "YYYY-MM-DD",   // Latest departure date (e.g., "2024-06-07")
  "num_adult_passengers": number           // Number of adult passengers (e.g., 1)
}
```

**Example Request:**

```json
{
  "origin": "New York",
  "destination": "Las Vegas",
  "earliest_departure_date": "2025-06-01",
  "latest_departure_date": "2025-06-07",
  "num_adult_passengers": 1
}
```

**Response:**

The API will return a JSON array of mock flight objects. The structure of each flight object is not strictly defined here but will represent a potential flight option.

Example Response (Illustrative):

```json
[
  {
    "flight_number": "MOCK123",
    "origin": "New York",
    "destination": "Las Vegas",
    "departure_time": "2025-06-02T08:00:00Z",
    "arrival_time": "2025-06-02T10:00:00Z",
    "price": 250.00
  },
  {
    "flight_number": "MOCK456",
    "origin": "New York",
    "destination": "Las Vegas",
    "departure_time": "2025-06-05T14:00:00Z",
    "arrival_time": "2025-06-05T16:00:00Z",
    "price": 280.50
  }
]
```

## Prerequisites
* Node.js (version 18 or higher recommended)
* npm (usually comes with Node.js)
* just command runner
* Google Cloud CLI (gcloud) installed and configured with your project

## Getting Started

Clone the repository:

```bash
git clone https://github.com/garzoglio/flight-search-mock-api
cd flight-search-mock-api
```
Install dependencies:

```bash
npm install
```

## Deployment to Google Cloud Run
This project uses just to simplify the deployment process to Google Cloud Run, leveraging Cloud Build to create the container image and Artifact Registry (or Container Registry) to store it.

Ensure you are authenticated with Google Cloud:

```bash
gcloud auth login
gcloud config set project <YOUR_GOOGLE_CLOUD_PROJECT_ID>
```
Review the Justfile: The Justfile contains the deployment recipe. Make sure the SERVICE_ACCOUNT, REGION, PROJECT_ID, and SERVICE_NAME variables at the top of the file are set correctly for your Google Cloud project.

Deploy using just: Run the following command from the root of the project directory:

```bash
just deploy
```

This command will:

* Use Cloud Build to build the Docker image from your Dockerfile.
* Tag the image and push it to Google Container Registry (GCR)
* Deploy a new service (or update the existing one) to Cloud Run with the newly built image.
* Update the traffic to point to the latest revision.

Access the API: Once deployed, you can access the API using the Cloud Run service URL provided in the output of the gcloud run deploy command.

## Testing the API

Once deployed, you can test the API using curl. Replace <YOUR_CLOUDRUN_URL> with the actual URL of your Cloud Run service:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "origin": "New York",
  "destination": "Las Vegas",
  "earliest_departure_date": "2024-06-01",
  "latest_departure_date": "2024-06-07",
  "num_adult_passengers": 1
}' https://<YOUR_CLOUDRUN_URL>/dialogflow/search_flights
```

**Running Locally (Optional)**

Build the TypeScript code:

```bash
npm run build
```

Run the server:

```bash
npm start
```

The API will be accessible at http://localhost:3001 . You can then send requests to http://localhost:3001/dialogflow/search_flights .

You can also use the just recipes for local development (if defined in your Justfile, e.g., just build-local, just run-local).


