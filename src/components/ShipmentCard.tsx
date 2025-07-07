
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shipment } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ShipmentCardProps {
  shipment: Shipment;
  compact?: boolean;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment, compact = false }) => {
  // Format the estimated delivery date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'exception':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get the latest event
  const latestEvent = shipment.trackingHistory && shipment.trackingHistory.length > 0
    ? shipment.trackingHistory[0]
    : null;

  // Format the time ago
  const timeAgo = latestEvent
    ? formatDistanceToNow(new Date(latestEvent.timestamp), { addSuffix: true })
    : '';

  if (compact) {
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{shipment.trackingNumber}</div>
              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                {shipment.destinationAddress.formatted || `${shipment.destinationAddress.city}, ${shipment.destinationAddress.state}`}
              </div>
            </div>
            <Badge className={getStatusColor(shipment.status)}>
              {formatStatus(shipment.status)}
            </Badge>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {latestEvent ? timeAgo : 'No updates'}
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/track/${shipment.trackingNumber}`}>Track</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{shipment.trackingNumber}</h3>
              <Badge className={getStatusColor(shipment.status)}>
                {formatStatus(shipment.status)}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {shipment.carrier?.name || 'Olori24'} • Created {formatDistanceToNow(new Date(shipment.createdAt), { addSuffix: true })}
            </div>
          </div>
          <Button className="mt-2 md:mt-0" asChild>
            <Link to={`/track/${shipment.trackingNumber}`}>Track Shipment</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">From</div>
            <div className="font-medium">{shipment.originAddress.formatted || 
              `${shipment.originAddress.street}, ${shipment.originAddress.city}, ${shipment.originAddress.state}`}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">To</div>
            <div className="font-medium">{shipment.destinationAddress.formatted || 
              `${shipment.destinationAddress.street}, ${shipment.destinationAddress.city}, ${shipment.destinationAddress.state}`}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Estimated Delivery</div>
            <div className="font-medium">{formatDate(shipment.enhancedETA || shipment.estimatedDelivery)}</div>
          </div>
          {shipment.weight && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Weight</div>
              <div className="font-medium">{shipment.weight} {shipment.weightUnit}</div>
            </div>
          )}
          {shipment.isPriority && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Service</div>
              <div className="font-medium">Priority</div>
            </div>
          )}
          {shipment.isSignatureRequired && (
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Requirements</div>
              <div className="font-medium">Signature Required</div>
            </div>
          )}
        </div>

        {latestEvent && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-1">Latest Update</div>
            <div className="font-medium">{latestEvent.status}</div>
            <div className="text-sm text-muted-foreground">
              {latestEvent.location && `${latestEvent.location} • `}{timeAgo}
            </div>
            {latestEvent.description && (
              <div className="text-sm mt-1">{latestEvent.description}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShipmentCard;