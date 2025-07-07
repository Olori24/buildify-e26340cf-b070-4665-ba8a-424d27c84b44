
import React from 'react';
import { Shipment, TrackingEvent } from '@/types';

interface ShipmentMapProps {
  shipment: Shipment;
  className?: string;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipment, className }) => {
  // In a real implementation, this would use a mapping library like Google Maps or Mapbox
  // For now, we'll create a simplified visual representation
  
  const originCity = shipment.originAddress.city;
  const destinationCity = shipment.destinationAddress.city;
  
  // Get the latest event to determine current location
  const latestEvent = shipment.trackingHistory && shipment.trackingHistory.length > 0
    ? shipment.trackingHistory[0]
    : null;
  
  // Calculate progress percentage based on status
  const getProgressPercentage = () => {
    switch (shipment.status) {
      case 'pending':
        return 0;
      case 'processing':
        return 10;
      case 'in_transit':
        return 50;
      case 'out_for_delivery':
        return 80;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };
  
  const progress = getProgressPercentage();
  
  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold text-lg mb-4">Shipment Progress</h3>
      
      <div className="relative h-4 bg-gray-200 rounded-full mb-6">
        <div 
          className="absolute h-4 bg-primary rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mb-2">
        <div className="text-sm font-medium">{originCity}</div>
        <div className="text-sm font-medium">{destinationCity}</div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <div>Origin</div>
        <div>Destination</div>
      </div>
      
      {latestEvent && latestEvent.location && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm font-medium">Current Location</div>
          <div className="text-sm">{latestEvent.location}</div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-center text-muted-foreground">
        This is a simplified representation. In the full app, this would be an interactive map showing the package's journey.
      </div>
    </div>
  );
};

export default ShipmentMap;