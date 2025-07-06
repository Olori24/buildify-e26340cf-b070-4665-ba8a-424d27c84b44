
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from '@/types';
import PackageDetails from '@/components/PackageDetails';
import TrackingTimeline from '@/components/TrackingTimeline';
import DeliveryMap from '@/components/DeliveryMap';
import PackageStatusBadge from '@/components/PackageStatusBadge';
import { getPackageByTrackingNumber } from '@/lib/supabase';
import Logo from '@/components/Logo';

const TrackingPage: React.FC = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!trackingNumber) {
        setError('No tracking number provided');
        setLoading(false);
        return;
      }

      try {
        const data = await getPackageByTrackingNumber(trackingNumber);
        
        if (!data) {
          setError('Package not found');
        } else {
          setPackageData(data);
        }
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Failed to fetch package information');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [trackingNumber]);

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

  if (error || !packageData) {
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
              <h2 className="text-2xl font-bold text-destructive">Package Not Found</h2>
              <p className="text-muted-foreground">
                {error || 'We couldn\'t find a package with the provided tracking number.'}
              </p>
              <Button asChild className="mt-4">
                <Link to="/">Track Another Package</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLocation = packageData.trackingHistory[0]?.location || '';

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Tracking Details</h1>
                <p className="text-muted-foreground">Tracking Number: {packageData.trackingNumber}</p>
              </div>
              <div className="flex items-center gap-4">
                <PackageStatusBadge status={packageData.status} />
                <Button asChild variant="outline">
                  <Link to="/">Track Another Package</Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <PackageDetails packageData={packageData} />
                <DeliveryMap 
                  origin={packageData.origin} 
                  destination={packageData.destination}
                  currentLocation={currentLocation}
                />
              </div>
              <TrackingTimeline events={packageData.trackingHistory} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingPage;