// mockApis.test.ts

// tests/mockApis.test.ts
import { searchFlights } from '../chat-engine/mock-apis/flightAPI';
import { searchHotels } from '../chat-engine/mock-apis/hotelAPI';
import { applyVisa } from '../chat-engine/mock-apis/visaAPI';

describe('Mock APIs', () => {
  test('flight search API', async () => {
    const res = await searchFlights({
      from: 'DEL',
      to: 'LIS',
      date: '2025-06-10'
    });

    expect(res.best).toBeDefined();
    expect(res.best.flight).toBeDefined();
    expect(res.best.price).toBeGreaterThan(0);
    expect(res.proof).toMatch(/^proof-flight-/);
    expect(res.options).toBeDefined();
    expect(res.options?.length).toBeGreaterThan(0);
  });

  test('hotel search API', async () => {
    const res = await searchHotels({
      location: 'Lisbon',
      checkIn: '2025-06-10',
      checkOut: '2025-06-20'
    });

    expect(res.best).toBeDefined();
    expect(res.best.name).toBeDefined();
    expect(res.best.price).toBeGreaterThan(0);
    expect(res.proof).toMatch(/^proof-hotel-/);
    expect(res.results).toBeDefined();
    expect(res.results?.length).toBeGreaterThan(0);
  });

  test('visa application API', async () => {
    const res = await applyVisa({
      nationality: 'India',
      travelDates: 'June 10-20',
      passport: 'K1234567'
    });

    expect(res.trackingId).toMatch(/^VIS/);
    expect(res.proof).toMatch(/^proof-visa-/);
    expect(res.status).toBe('submitted');
  });
});
