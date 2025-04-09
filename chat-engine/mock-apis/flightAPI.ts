// flightAPI.ts

interface FlightSearchParams {
  from: string;
  to: string;
  date: string;
}

interface FlightResult {
  best: {
    flight: string;
    price: number;
  };
  proof: string;
  options?: Array<{
    flight: string;
    price: number;
  }>;
}

export const searchFlights = async (params?: FlightSearchParams): Promise<FlightResult> => {
  return {
    best: {
      flight: 'AI123',
      price: 500
    },
    proof: 'proof-flight-1',
    options: [
      {
        flight: 'AI123',
        price: 500
      },
      {
        flight: 'LH456',
        price: 650
      }
    ]
  };
};
  