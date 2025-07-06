
import { Package, TrackingEvent } from "@/types";

// Generate a random tracking number
export const generateTrackingNumber = (): string => {
  const prefix = "PKG";
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
  return `${prefix}${randomDigits}`;
};

// Mock packages data
export const mockPackages: Package[] = [
  {
    id: "1",
    trackingNumber: "PKG12345678",
    status: "in-transit",
    estimatedDelivery: "2025-07-10",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    weight: "5.2 lbs",
    service: "Express",
    recipient: {
      name: "John Doe",
      address: "123 Main St",
      city: "Los Angeles",
      state: "CA",
      zip: "90001"
    },
    sender: {
      name: "ABC Company",
      address: "456 Business Ave",
      city: "New York",
      state: "NY",
      zip: "10001"
    },
    trackingHistory: [
      {
        id: "event1",
        timestamp: "2025-07-03T08:30:00Z",
        location: "New York, NY",
        status: "Package received",
        description: "Package has been received at origin facility"
      },
      {
        id: "event2",
        timestamp: "2025-07-04T14:15:00Z",
        location: "Columbus, OH",
        status: "In transit",
        description: "Package arrived at sort facility"
      },
      {
        id: "event3",
        timestamp: "2025-07-05T19:45:00Z",
        location: "Denver, CO",
        status: "In transit",
        description: "Package departed from sort facility"
      }
    ]
  },
  {
    id: "2",
    trackingNumber: "PKG87654321",
    status: "delivered",
    estimatedDelivery: "2025-07-05",
    origin: "Chicago, IL",
    destination: "Miami, FL",
    weight: "3.7 lbs",
    service: "Standard",
    recipient: {
      name: "Jane Smith",
      address: "789 Ocean Dr",
      city: "Miami",
      state: "FL",
      zip: "33139"
    },
    sender: {
      name: "XYZ Corp",
      address: "101 Corporate Pkwy",
      city: "Chicago",
      state: "IL",
      zip: "60601"
    },
    trackingHistory: [
      {
        id: "event1",
        timestamp: "2025-07-01T10:00:00Z",
        location: "Chicago, IL",
        status: "Package received",
        description: "Package has been received at origin facility"
      },
      {
        id: "event2",
        timestamp: "2025-07-02T16:30:00Z",
        location: "Indianapolis, IN",
        status: "In transit",
        description: "Package arrived at sort facility"
      },
      {
        id: "event3",
        timestamp: "2025-07-03T08:15:00Z",
        location: "Atlanta, GA",
        status: "In transit",
        description: "Package departed from sort facility"
      },
      {
        id: "event4",
        timestamp: "2025-07-04T14:45:00Z",
        location: "Orlando, FL",
        status: "In transit",
        description: "Package arrived at regional facility"
      },
      {
        id: "event5",
        timestamp: "2025-07-05T09:30:00Z",
        location: "Miami, FL",
        status: "Out for delivery",
        description: "Package is out for delivery"
      },
      {
        id: "event6",
        timestamp: "2025-07-05T13:15:00Z",
        location: "Miami, FL",
        status: "Delivered",
        description: "Package has been delivered"
      }
    ]
  },
  {
    id: "3",
    trackingNumber: "PKG24681357",
    status: "out-for-delivery",
    estimatedDelivery: "2025-07-06",
    origin: "Seattle, WA",
    destination: "Boston, MA",
    weight: "8.1 lbs",
    service: "Priority",
    recipient: {
      name: "Robert Johnson",
      address: "555 Commonwealth Ave",
      city: "Boston",
      state: "MA",
      zip: "02215"
    },
    sender: {
      name: "Tech Solutions Inc",
      address: "888 Tech Way",
      city: "Seattle",
      state: "WA",
      zip: "98101"
    },
    trackingHistory: [
      {
        id: "event1",
        timestamp: "2025-07-02T09:15:00Z",
        location: "Seattle, WA",
        status: "Package received",
        description: "Package has been received at origin facility"
      },
      {
        id: "event2",
        timestamp: "2025-07-03T11:30:00Z",
        location: "Minneapolis, MN",
        status: "In transit",
        description: "Package arrived at sort facility"
      },
      {
        id: "event3",
        timestamp: "2025-07-04T16:45:00Z",
        location: "Chicago, IL",
        status: "In transit",
        description: "Package departed from sort facility"
      },
      {
        id: "event4",
        timestamp: "2025-07-05T14:20:00Z",
        location: "Boston, MA",
        status: "Arrived at destination",
        description: "Package arrived at local facility"
      },
      {
        id: "event5",
        timestamp: "2025-07-06T07:30:00Z",
        location: "Boston, MA",
        status: "Out for delivery",
        description: "Package is out for delivery"
      }
    ]
  }
];

// Mock service to get package by tracking number
export const getPackageByTracking = (trackingNumber: string): Package | undefined => {
  return mockPackages.find(pkg => pkg.trackingNumber === trackingNumber);
};

// Mock service to update package status
export const updatePackageStatus = (
  trackingNumber: string, 
  status: Package['status'], 
  location: string, 
  description: string
): Package | undefined => {
  const packageIndex = mockPackages.findIndex(pkg => pkg.trackingNumber === trackingNumber);
  
  if (packageIndex === -1) return undefined;
  
  const updatedPackage = { ...mockPackages[packageIndex] };
  updatedPackage.status = status;
  
  const newEvent: TrackingEvent = {
    id: `event${updatedPackage.trackingHistory.length + 1}`,
    timestamp: new Date().toISOString(),
    location,
    status: status === 'in-transit' ? 'In transit' : 
            status === 'out-for-delivery' ? 'Out for delivery' :
            status === 'delivered' ? 'Delivered' :
            status === 'exception' ? 'Exception' : 'Pending',
    description
  };
  
  updatedPackage.trackingHistory = [...updatedPackage.trackingHistory, newEvent];
  mockPackages[packageIndex] = updatedPackage;
  
  return updatedPackage;
};

// Mock service to create a new package
export const createPackage = (packageData: Omit<Package, 'id' | 'trackingNumber' | 'trackingHistory'>): Package => {
  const newPackage: Package = {
    ...packageData,
    id: (mockPackages.length + 1).toString(),
    trackingNumber: generateTrackingNumber(),
    trackingHistory: [
      {
        id: "event1",
        timestamp: new Date().toISOString(),
        location: packageData.origin,
        status: "Package received",
        description: "Package has been received at origin facility"
      }
    ]
  };
  
  mockPackages.push(newPackage);
  return newPackage;
};

// Mock service to get all packages
export const getAllPackages = (): Package[] => {
  return [...mockPackages];
};