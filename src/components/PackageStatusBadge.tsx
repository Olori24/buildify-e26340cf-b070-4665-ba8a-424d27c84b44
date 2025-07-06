
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Package } from '@/types';

interface PackageStatusBadgeProps {
  status: Package['status'];
  className?: string;
}

const PackageStatusBadge: React.FC<PackageStatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', variant: 'outline' as const };
      case 'in-transit':
        return { label: 'In Transit', variant: 'secondary' as const };
      case 'out-for-delivery':
        return { label: 'Out for Delivery', variant: 'default' as const };
      case 'delivered':
        return { label: 'Delivered', variant: 'success' as const };
      case 'exception':
        return { label: 'Exception', variant: 'destructive' as const };
      default:
        return { label: 'Unknown', variant: 'outline' as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default PackageStatusBadge;