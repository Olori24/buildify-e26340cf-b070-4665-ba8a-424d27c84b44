
import type { Database } from './database';

export type Tables = Database['public']['Tables'];
export type PackageRow = Tables['packages']['Row'];
export type TrackingEventRow = Tables['tracking_events']['Row'];
export type UserRow = Tables['users']['Row'];

export interface Package {
  id: string;
  trackingNumber: string;
  status: 'Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception';
  estimatedDelivery: string;
  origin: string;
  destination: string;
  weight: string;
  dimensions?: string;
  recipient: {
    name: string;
    address: string;
  };
  sender: {
    name: string;
    address: string;
  };
  trackingHistory: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'driver' | 'customer';
  phoneNumber?: string;
  address?: string;
}