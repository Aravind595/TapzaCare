export type SectionType =
  | 'hero_banner'
  | 'category_chips'
  | 'quick_actions'
  | 'service_grid'
  | 'doctor_carousel'
  | 'offer_strip';

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  festival?: {
    name: string;
    greeting: string;
    bannerImageUrl: string;
  };
}

export interface HomeItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price?: number;
  badge?: string;
}

export interface SectionBackground {
  kind: 'color' | 'gradient' | 'image';
  value: string;
}

export interface HomeSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  background?: SectionBackground;
  items?: HomeItem[];
}

export interface HomeConfig {
  version: number;
  theme: Theme;
  tabs: {
    id: string;
    label: string;
    icon: string;
    screen: string;
  }[];
  sections: HomeSection[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  feeInr: number;
  languages: string[];
}

export interface Slot {
  id: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  dose: string;
  days: number;
  timing: ('morning' | 'afternoon' | 'night')[];
}

export interface Prescription {
  id: string;
  issuedAt: string;
  doctorName: string;
  clinicName: string;
  medicines: Medicine[];
}

export interface Booking {
  id: string;
  doctorId: string;
  slotId: string;
  status: 'confirmed' | 'pending';
}