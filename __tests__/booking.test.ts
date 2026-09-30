import {createBooking, getSlots} from '../src/services/mockApi';

describe('Booking mock API', () => {
  it('returns available slots', async () => {
    const slots = await getSlots('1', '2026-10-01');
    expect(slots.length).toBeGreaterThan(0);
  });

  it('creates a booking for an available slot', async () => {
    const slots = await getSlots('1', '2026-10-01');
    const booking = await createBooking('1', slots[0].id);

    expect(booking.status).toBe('confirmed');
  });
});