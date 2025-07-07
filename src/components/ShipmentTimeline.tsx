
import React from 'react';
import { TrackingEvent } from '@/types';
import { format } from 'date-fns';
import { CheckCircle, Clock, AlertCircle, TruckIcon, PackageIcon } from 'lucide-react';

interface ShipmentTimelineProps {
  events: TrackingEvent[];
}

const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tracking events available</p>
      </div>
    );
  }

  // Get icon based on status
  const getStatusIcon = (status: string) => {
    const iconProps = { className: "h-5 w-5" };
    
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle {...iconProps} className="text-green-500 h-5 w-5" />;
      case 'in_transit':
        return <TruckIcon {...iconProps} className="text-blue-500 h-5 w-5" />;
      case 'out_for_delivery':
        return <TruckIcon {...iconProps} className="text-purple-500 h-5 w-5" />;
      case 'pending':
      case 'processing':
        return <Clock {...iconProps} className="text-yellow-500 h-5 w-5" />;
      case 'exception':
      case 'cancelled':
        return <AlertCircle {...iconProps} className="text-red-500 h-5 w-5" />;
      default:
        return <PackageIcon {...iconProps} className="text-gray-500 h-5 w-5" />;
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: format(date, 'MMM d, yyyy'),
        time: format(date, 'h:mm a')
      };
    } catch (error) {
      return { date: 'Invalid date', time: '' };
    }
  };

  return (
    <div className="space-y-1">
      <h3 className="font-semibold text-lg mb-4">Tracking History</h3>
      <div className="space-y-6">
        {events.map((event, index) => {
          const { date, time } = formatDateTime(event.timestamp);
          const isLast = index === events.length - 1;
          
          return (
            <div key={event.id} className="relative pl-8">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-[10px] top-[24px] bottom-[-24px] w-[1px] bg-gray-200"></div>
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-1">
                {getStatusIcon(event.status)}
              </div>
              
              {/* Content */}
              <div>
                <div className="font-medium">{event.status}</div>
                <div className="text-sm text-muted-foreground">
                  {event.location && `${event.location} • `}{date} • {time}
                </div>
                {event.description && (
                  <div className="text-sm mt-1">{event.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipmentTimeline;