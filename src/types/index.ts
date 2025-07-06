
export interface Package {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'exception';
  estimatedDelivery: string;
  origin: string;
  destination: string;
  weight: string;
  service: string;
  recipient: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  sender: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
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
  name: string;
  role: 'admin' | 'driver' | 'customer';
}