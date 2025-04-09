// hotelAPI.ts

interface HotelSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
}

interface HotelResult {
  best: {
    name: string;
    price: number;
  };
  proof: string;
  results?: Array<{
    name: string;
    price: number;
  }>;
}

export const searchHotels = async (params?: HotelSearchParams): Promise<HotelResult> => {
  return {
    best: {
      name: 'Grand Hotel',
      price: 200
    },
    proof: 'proof-hotel-1',
    results: [
      {
        name: 'Grand Hotel',
        price: 200
      },
      {
        name: 'Plaza Hotel',
        price: 300
      }
    ]
  };
};
  