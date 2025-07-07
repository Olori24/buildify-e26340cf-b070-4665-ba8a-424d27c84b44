
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Shipment } from '@/types';
import { getShipmentByTrackingNumber } from '@/lib/supabase';
import Logo from '@/components/Logo';
import { format, formatDistanceToNow } from 'date-fns';
import { MapPin, Calendar, Package, Truck, AlertTriangle, CheckCircle } from 'lucide-react';

const TrackingPage: React.FC = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipment = async () => {
      if (!trackingNumber) {
        setError('No tracking number provided');
        setLoading(false);
        return;
      }

      try {
        const data = await getShipmentByTrackingNumber(trackingNumber);
        
        if (!data) {
          setError('Shipment not found');
        } else {
          setShipment(data);
        }
      } catch (err) {
        console.error('Error fetching shipment:', err);
        setError('Failed to fetch shipment information');
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [trackingNumber]);

  // Format the estimated delivery date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_transit':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'out_for_delivery':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'pending':
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-600" />;
      case 'exception':
      case 'cancelled':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo size="lg" variant="full" />
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-60 w-full" />
                </div>
                <Skeleton className="h-[400px] w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo size="lg" variant="full" />
          </Link>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="py-12 space-y-4">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
              <h2 className="text-2xl font-bold text-destructive">Shipment Not Found</h2>
              <p className="text-muted-foreground">
                {error || 'We couldn\'t find a shipment with the provided tracking number.'}
              </p>
              <Button asChild className="mt-4">
                <Link to="/">Track Another Shipment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get the latest event
  const latestEvent = shipment.trackingHistory && shipment.trackingHistory.length > 0
    ? shipment.trackingHistory[0]
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <Link to="/">
          <Logo size="lg" variant="full" />
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Tracking Details</h1>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground">Tracking Number: <span className="font-medium">{shipment.trackingNumber}</span></p>
                {shipment.carrier && (
                  <p className="text-muted-foreground">• Carrier: <span className="font-medium">{shipment.carrier.name}</span></p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`px-3 py-1 text-sm ${getStatusColor(shipment.status)}`}>
                {formatStatus(shipment.status)}
              </Badge>
              <Button asChild variant="outline">
                <Link to="/">Track Another Shipment</Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">From</h3>
                  <p className="font-medium">{shipment.originAddress.formatted || 
                    `${shipment.originAddress.city}, ${shipment.originAddress.state}`}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">To</h3>
                  <p className="font-medium">{shipment.destinationAddress.formatted || 
                    `${shipment.destinationAddress.city}, ${shipment.destinationAddress.state}`}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Estimated Delivery</h3>
                  <p className="font-medium">{formatDate(shipment.enhancedETA || shipment.estimatedDelivery)}</p>
                  {shipment.enhancedETA && shipment.enhancedETA !== shipment.estimatedDelivery && (
                    <p className="text-xs text-primary mt-1">AI-enhanced prediction</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Tracking History</h2>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {shipment.trackingHistory.map((event, index) => (
                  <div key={event.id} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                        <h3 className="font-bold">{formatStatus(event.status)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.timestamp), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      {event.location && (
                        <p className="text-sm mb-1">{event.location}</p>
                      )}
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-bold mb-4">Shipment Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="space-y-4">
                  {shipment.weight && (
                    <div className="grid grid-cols-2">
                      <dt className="text-sm text-muted-foreground">Weight</dt>
                      <dd className="font-medium">{shipment.weight} {shipment.weightUnit}</dd>
                    </div>
                  )}
                  {shipment.dimensions && (
                    <div className="grid grid-cols-2">
                      <dt className="text-sm text-muted-foreground">Dimensions</dt>
                      <dd className="font-medium">
                        {`${shipment.dimensions.length}x${shipment.dimensions.width}x${shipment.dimensions.height} ${shipment.dimensions.unit}`}
                      </dd>
                    </div>
                  )}
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Service Type</dt>
                    <dd className="font-medium">{shipment.isPriority ? 'Priority' : 'Standard'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Signature Required</dt>
                    <dd className="font-medium">{shipment.isSignatureRequired ? 'Yes' : 'No'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Created</dt>
                    <dd className="font-medium">{format(new Date(shipment.createdAt), 'MMM d, yyyy')}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {shipment.proofOfDelivery && (
              <div>
                <h2 className="text-lg font-bold mb-4">Proof of Delivery</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-4">
                    <div className="grid grid-cols-2">
                      <dt className="text-sm text-muted-foreground">Delivered On</dt>
                      <dd className="font-medium">{format(new Date(shipment.proofOfDelivery.timestamp), 'MMM d, yyyy • h:mm a')}</dd>
                    </div>
                    {shipment.proofOfDelivery.recipientName && (
                      <div className="grid grid-cols-2">
                        <dt className="text-sm text-muted-foreground">Received By</dt>
                        <dd className="font-medium">{shipment.proofOfDelivery.recipientName}</dd>
                      </div>
                    )}
                    {shipment.proofOfDelivery.signatureUrl && (
                      <div className="col-span-2">
                        <dt className="text-sm text-muted-foreground mb-2">Signature</dt>
                        <dd>
                          <img 
                            src={shipment.proofOfDelivery.signatureUrl} 
                            alt="Signature" 
                            className="max-h-20 border rounded p-2 bg-white"
                          />
                        </dd>
                      </div>
                    )}
                    {shipment.proofOfDelivery.photoUrl && (
                      <div className="col-span-2">
                        <dt className="text-sm text-muted-foreground mb-2">Photo Confirmation</dt>
                        <dd>
                          <img 
                            src={shipment.proofOfDelivery.photoUrl} 
                            alt="Delivery confirmation" 
                            className="max-h-40 rounded"
                          />
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Need help with this shipment?
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="sm">Contact Support</Button>
          <Button variant="outline" size="sm">Report an Issue</Button>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;