
import React from 'react';
import { Package } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PackageStatusBadge from './PackageStatusBadge';
import { format } from 'date-fns';

interface PackageDetailsProps {
  packageData: Package;
}

const PackageDetails: React.FC<PackageDetailsProps> = ({ packageData }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Package Details</CardTitle>
          <PackageStatusBadge status={packageData.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Tracking Number</h3>
            <p className="text-lg font-semibold">{packageData.trackingNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Service</h3>
            <p>{packageData.service}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Weight</h3>
            <p>{packageData.weight}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Estimated Delivery</h3>
            <p>{format(new Date(packageData.estimatedDelivery), 'MMMM d, yyyy')}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">From</h3>
            <div className="space-y-1">
              <p className="font-medium">{packageData.sender.name}</p>
              <p>{packageData.sender.address}</p>
              <p>{packageData.sender.city}, {packageData.sender.state} {packageData.sender.zip}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">To</h3>
            <div className="space-y-1">
              <p className="font-medium">{packageData.recipient.name}</p>
              <p>{packageData.recipient.address}</p>
              <p>{packageData.recipient.city}, {packageData.recipient.state} {packageData.recipient.zip}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageDetails;