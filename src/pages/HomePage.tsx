
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrackingForm from '@/components/TrackingForm';
import Logo from '@/components/Logo';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <Logo size="lg" variant="full" className="mb-6" />
        <h1 className="text-4xl font-bold tracking-tight mb-4">Track Your Package</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Enter your tracking number to get real-time updates on your delivery status.
        </p>
      </div>
      
      <div className="max-w-md mx-auto mb-16">
        <TrackingForm />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            <CardTitle>Secure Delivery</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Your packages are handled with care and delivered securely to their destination.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <CardTitle>Real-Time Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Track your packages in real-time with detailed updates at every step of the delivery process.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <CardTitle>Dedicated Support</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Our customer support team is available 24/7 to assist you with any delivery concerns.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Business Solutions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          OLORI24 offers comprehensive logistics solutions for businesses of all sizes. From e-commerce fulfillment to corporate deliveries, we've got you covered.
        </p>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default HomePage;