import {
  Doctor,
  Slot,
  Prescription,
  Booking,
  HomeConfig,
} from '../types';

import {normalConfig} from '../config/normalConfig';

export let mockSettings = {
  latency: 500,
  shouldFail: false,
};

export const setMockSettings = (
  latency: number,
  shouldFail: boolean,
) => {
  mockSettings = {latency, shouldFail};
};

const wait = () =>
  new Promise<void>(resolve =>
    setTimeout(resolve, mockSettings.latency),
  );

const checkFailure = () => {
  if (mockSettings.shouldFail) {
    throw new Error('Mock network error. Please try again.');
  }
};

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Rahul',
    specialty: 'General Physician',
    photoUrl: '',
    feeInr: 499,
    languages: ['English', 'Telugu', 'Hindi'],
  },
  {
    id: '2',
    name: 'Dr. Priya',
    specialty: 'Dentist',
    photoUrl: '',
    feeInr: 599,
    languages: ['English', 'Telugu'],
  },
  {
    id: '3',
    name: 'Dr. Anil',
    specialty: 'Cardiologist',
    photoUrl: '',
    feeInr: 799,
    languages: ['English', 'Hindi'],
  },
];

let slots: Slot[] = [
  {
    id: 'slot-1',
    doctorId: '1',
    startsAt: '2026-10-01T09:00:00',
    endsAt: '2026-10-01T09:30:00',
    available: true,
  },
  {
    id: 'slot-2',
    doctorId: '1',
    startsAt: '2026-10-01T10:00:00',
    endsAt: '2026-10-01T10:30:00',
    available: true,
  },
  {
    id: 'slot-3',
    doctorId: '2',
    startsAt: '2026-10-01T11:00:00',
    endsAt: '2026-10-01T11:30:00',
    available: true,
  },
];

const prescriptions: Prescription[] = [
  {
    id: 'prescription-1',
    issuedAt: '2026-09-28',
    doctorName: 'Dr. Rahul',
    clinicName: 'Tapza Clinic, Hyderabad',
    medicines: [
      {
        id: 'med-1',
        name: 'Paracetamol',
        dose: '500 mg',
        days: 3,
        timing: ['morning', 'night'],
      },
      {
        id: 'med-2',
        name: 'Vitamin D',
        dose: '1 tablet',
        days: 7,
        timing: ['morning'],
      },
    ],
  },
];

export const getConfig = async (): Promise<HomeConfig> => {
  await wait();
  checkFailure();
  return normalConfig;
};

export const getDoctors = async (): Promise<Doctor[]> => {
  await wait();
  checkFailure();
  return doctors;
};

export const getSlots = async (
  doctorId: string,
  date: string,
): Promise<Slot[]> => {
  await wait();
  checkFailure();

  return slots.filter(
    slot =>
      slot.doctorId === doctorId &&
      slot.startsAt.startsWith(date) &&
      slot.available,
  );
};

export const createBooking = async (
  doctorId: string,
  slotId: string,
): Promise<Booking> => {
  await wait();
  checkFailure();

  const slot = slots.find(
    item => item.id === slotId && item.doctorId === doctorId,
  );

  if (!slot || !slot.available) {
    const error = new Error('This slot is already taken.') as Error & {
      status?: number;
    };
    error.status = 409;
    throw error;
  }

  slot.available = false;

  return {
    id: `booking-${Date.now()}`,
    doctorId,
    slotId,
    status: 'confirmed',
  };
};

export const getPrescriptions = async (): Promise<Prescription[]> => {
  await wait();
  checkFailure();
  return prescriptions;
};