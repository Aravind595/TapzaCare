import {HomeConfig} from '../types';

export const festivalConfig: HomeConfig = {
  version: 2,

  theme: {
    primary: '#B91C1C',
    secondary: '#FEE2E2',
    background: '#FFF7ED',
    surface: '#FFFFFF',
    textPrimary: '#7F1D1D',
    textSecondary: '#92400E',
    accent: '#15803D',

    festival: {
      name: 'Diwali',
      greeting: 'Happy Diwali!',
      bannerImageUrl: '',
    },
  },

  tabs: [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      screen: 'home',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'calendar',
      screen: 'bookings',
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions',
      icon: 'file',
      screen: 'prescriptions',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      screen: 'profile',
    },
  ],

  sections: [
    {
      id: 'festival-banner',
      type: 'hero_banner',
      title: 'Happy Diwali!',
      subtitle:
        'Celebrate a healthy and happy festival with Tapza Care',
      background: {
        kind: 'color',
        value: '#FDE68A',
      },
    },

    {
      id: 'festival-offer',
      type: 'offer_strip',
      title: 'Diwali Health Checkup Offers',
      background: {
        kind: 'color',
        value: '#FECACA',
      },
    },

    {
      id: 'festival-actions',
      type: 'quick_actions',
      title: 'Your Health Services',
      background: {
        kind: 'color',
        value: '#FFFFFF',
      },
      items: [
        {
          id: '1',
          title: 'Book Appointment',
        },
        {
          id: '2',
          title: 'My Prescriptions',
        },
        {
          id: '3',
          title: 'Reminders',
        },
        {
          id: '4',
          title: 'Family',
        },
      ],
    },

    {
      id: 'festival-doctors',
      type: 'doctor_carousel',
      title: 'Our Doctors',
      background: {
        kind: 'color',
        value: '#FFF7ED',
      },
      items: [
        {
          id: '1',
          title: 'Dr. Rahul',
          description: 'General Physician',
        },
        {
          id: '2',
          title: 'Dr. Priya',
          description: 'Dentist',
        },
      ],
    },

    {
      id: 'festival-categories',
      type: 'category_chips',
      title: 'Explore Categories',
      background: {
        kind: 'color',
        value: '#FFFFFF',
      },
      items: [
        {
          id: '1',
          title: 'General',
        },
        {
          id: '2',
          title: 'Dental',
        },
        {
          id: '3',
          title: 'Cardiology',
        },
        {
          id: '4',
          title: 'Skin',
        },
      ],
    },

    {
      id: 'festival-services',
      type: 'service_grid',
      title: 'Festival Services',
      background: {
        kind: 'color',
        value: '#FEF3C7',
      },
      items: [
        {
          id: '1',
          title: 'Doctor Consultation',
          price: 399,
        },
        {
          id: '2',
          title: 'Lab Tests',
          price: 249,
        },
        {
          id: '3',
          title: 'Pharmacy',
          price: 199,
        },
        {
          id: '4',
          title: 'Health Checkup',
          price: 799,
        },
      ],
    },
  ],
};