
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getPackageByTrackingNumber } from '@/lib/supabase';

const TrackingForm: React.FC = () => {
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
      // Check if the package exists
      const packageData = await getPackageByTrackingNumber(trackingNumber);
      
      if (!packageData) {
        toast({
          title: "Package not found",
          description: "No package found with the provided tracking number",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Navigate to the tracking page
      navigate(`/track/${trackingNumber}`);
    } catch (error) {
      console.error('Error tracking package:', error);
      toast({
        title: "Error",
        description: "Failed to track package. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter tracking number (e.g., OLR24-1001)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Tracking...' : 'Track Package'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TrackingForm;