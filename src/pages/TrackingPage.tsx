
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getPackageByTracking } from '@/lib/mock-data';
import { Package } from '@/types';
import PackageDetails from '@/components/PackageDetails';
import TrackingTimeline from '@/components/TrackingTimeline';
import DeliveryMap from '@/components/DeliveryMap';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

const TrackingPage = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingNumber) {
      setError('No tracking number provided');
      setLoading(false);
      return;
    }

    // Simulate API call
    const timer = setTimeout(() => {
      const data = getPackageByTracking(trackingNumber);
      if (data) {
        setPackageData(data);
      } else {
        setError('Package not found');
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [trackingNumber]);

  // Get the current location from the most recent tracking event
  const getCurrentLocation = () => {
    if (!packageData || packageData.trackingHistory.length === 0) return null;
    
    const sortedEvents = [...packageData.trackingHistory].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return sortedEvents[0].location;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Package Tracking</h1>
          </div>
          <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error || 'An unknown error occurred'}</p>
            <Button asChild className="mt-4">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Package Tracking</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <PackageDetails packageData={packageData} />
          
          <DeliveryMap 
            origin={packageData.origin} 
            destination={packageData.destination} 
            currentLocation={getCurrentLocation() || undefined}
          />
          
          <TrackingTimeline events={packageData.trackingHistory} />
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;