
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getShipmentByTrackingNumber } from '@/lib/supabase';
import { Search, Loader2 } from 'lucide-react';

interface TrackingFormProps {
  variant?: 'default' | 'embedded';
  className?: string;
}

const TrackingForm: React.FC<TrackingFormProps> = ({ 
  variant = 'default',
  className
}) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking number required",
        description: "Please enter a valid tracking number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if the shipment exists
      const shipmentData = await getShipmentByTrackingNumber(trackingNumber);
      
      if (!shipmentData) {
        toast({
          title: "Shipment not found",
          description: "No shipment found with the provided tracking number",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Navigate to the tracking page
      navigate(`/track/${trackingNumber}`);
    } catch (error) {
      console.error('Error tracking shipment:', error);
      toast({
        title: "Error",
        description: "Failed to track shipment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (variant === 'embedded') {
    return (
      <form onSubmit={handleSubmit} className={`flex w-full ${className}`}>
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="pl-9 rounded-r-none"
          />
        </div>
        <Button 
          type="submit" 
          className="rounded-l-none" 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isLoading ? 'Tracking...' : 'Track'}
        </Button>
      </form>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Enter tracking number (e.g., OLR-20250707-12345)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full py-6 text-lg" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            {isLoading ? 'Tracking...' : 'Track Shipment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TrackingForm;

export default TrackingForm;