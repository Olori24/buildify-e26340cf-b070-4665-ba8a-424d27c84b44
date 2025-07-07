
import type { Database } from './database';

export type Tables = Database['public']['Tables'];
export type ShipmentRow = Tables['shipments']['Row'];
export type TrackingEventRow = Tables['tracking_events']['Row'];
export type UserRow = Tables['users']['Row'];
export type CarrierRow = Tables['carriers']['Row'];
export type DeliveryAssignmentRow = Tables['delivery_assignments']['Row'];
export type ProofOfDeliveryRow = Tables['proof_of_delivery']['Row'];

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formatted?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface Carrier {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  carrier?: Carrier;
  externalTrackingNumber?: string;
  status: 'pending' | 'processing' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'returned' | 'cancelled';
  estimatedDelivery: string;
  enhancedETA?: string;
  actualDelivery?: string;
  originAddress: Address;
  destinationAddress: Address;
  packageDetails?: any;
  weight?: number;
  weightUnit?: 'kg' | 'lb';
  dimensions?: Dimensions;
  shippingCost?: number;
  insuranceAmount?: number;
  isSignatureRequired: boolean;
  isPriority: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  trackingHistory: TrackingEvent[];
  proofOfDelivery?: ProofOfDelivery;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
  createdAt: string;
}

export interface ProofOfDelivery {
  id: string;
  shipmentId: string;
  driverId?: string;
  signatureUrl?: string;
  photoUrl?: string;
  recipientName?: string;
  notes?: string;
  timestamp: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  companyName?: string;
  companySize?: string;
  role: 'customer' | 'business' | 'driver' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Driver extends User {
  licenseNumber?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
  availabilityStatus: 'available' | 'busy' | 'offline';
  rating?: number;
}

export interface DeliveryAssignment {
  id: string;
  shipmentId: string;
  driverId?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  assignedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  shipmentId?: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface BusinessSettings {
  id: string;
  companyLogoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  trackingPageUrl?: string;
  emailTemplate?: any;
  smsTemplate?: any;
  apiKey?: string;
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
}