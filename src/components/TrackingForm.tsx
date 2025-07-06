
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPackageByTracking } from '@/lib/mock-data';
import { toast } from '@/components/ui/use-toast';

const TrackingForm = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const packageData = getPackageByTracking(trackingNumber);
      
      if (packageData) {
        navigate(`/track/${trackingNumber}`);
      } else {
        toast({
          title: "Package Not Found",
          description: "We couldn't find a package with that tracking number. Please check and try again.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Track Your Package</CardTitle>
        <CardDescription>Enter your tracking number to get real-time updates</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Input
              placeholder="Enter tracking number (e.g., PKG12345678)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              For demo, try: PKG12345678, PKG87654321, or PKG24681357
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Searching..." : "Track Package"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TrackingForm;