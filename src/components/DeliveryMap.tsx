
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeliveryMapProps {
  origin: string;
  destination: string;
  currentLocation?: string;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ origin, destination, currentLocation }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Route</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-md p-4 h-[300px] flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Map visualization would appear here</p>
            <p className="text-sm">From: {origin}</p>
            <p className="text-sm">To: {destination}</p>
            {currentLocation && <p className="text-sm font-medium">Current Location: {currentLocation}</p>}
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>This is a placeholder for a real map integration. In a production app, this would show the actual delivery route with real-time location updates.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryMap;