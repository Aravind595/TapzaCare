import {HomeConfig} from '../types';

export const normalConfig: HomeConfig = {
  version: 1,

  theme: {
    primary: '#2563EB',
    secondary: '#DBEAFE',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    accent: '#16A34A',
  },

  tabs: [
    {id: 'home', label: 'Home', icon: 'home', screen: 'home'},
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
      id: 'banner',
      type: 'hero_banner',
      title: 'Your Health, Our Priority',
      subtitle: 'Book appointments with trusted doctors',
      background: {
        kind: 'color',
        value: '#DBEAFE',
      },
    },

    {
      id: 'categories',
      type: 'category_chips',
      title: 'Categories',
      background: {
        kind: 'color',
        value: '#FFFFFF',
      },
      items: [
        {id: '1', title: 'General'},
        {id: '2', title: 'Dental'},
        {id: '3', title: 'Cardiology'},
        {id: '4', title: 'Skin'},
        {id: '5', title: 'Vaccines'},
      ],
    },

    {
      id: 'actions',
      type: 'quick_actions',
      title: 'Quick Actions',
      background: {
        kind: 'color',
        value: '#F1F5F9',
      },
      items: [
        {id: '1', title: 'Book Appointment'},
        {id: '2', title: 'My Prescriptions'},
        {id: '3', title: 'Reminders'},
        {id: '4', title: 'Family'},
      ],
    },

    {
      id: 'services',
      type: 'service_grid',
      title: 'Our Services',
      background: {
        kind: 'color',
        value: '#FFFFFF',
      },
      items: [
        {id: '1', title: 'Doctor Consultation', price: 499},
        {id: '2', title: 'Lab Tests', price: 299},
        {id: '3', title: 'Pharmacy', price: 199},
        {id: '4', title: 'Health Checkup', price: 999},
      ],
    },

    {
      id: 'doctors',
      type: 'doctor_carousel',
      title: 'Available Doctors',
      background: {
        kind: 'color',
        value: '#F1F5F9',
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
        {
          id: '3',
          title: 'Dr. Anil',
          description: 'Cardiologist',
        },
      ],
    },

    {
      id: 'offers',
      type: 'offer_strip',
      title: 'Special Health Checkup Offers',
      background: {
        kind: 'color',
        value: '#DCFCE7',
      },
    },
  ],
};