
import React from 'react';
import { TrackingEvent } from '@/types';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ events }) => {
  // Sort events by timestamp in descending order (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tracking History</h3>
      <div className="space-y-4">
        {sortedEvents.map((event, index) => (
          <Card key={event.id} className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200">
              {index === 0 && (
                <div className="absolute top-4 left-[-4px] w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <CardContent className="pl-8 py-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{event.status}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <span className="text-sm">{event.location}</span>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;