
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrackingForm from '@/components/TrackingForm';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, Truck, Users, BarChart3 } from 'lucide-react';

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Create Shipping Labels</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Create shipping labels quickly and easily with our user-friendly interface.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/create-label">Create Label</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Real-Time Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Track your packages in real-time with detailed updates at every step of the delivery process.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/#tracking">Track Package</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Personal & Business</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Create an account for personal use or set up a business account for your company's shipping needs.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Shipment Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Manage all your shipments in one place with our comprehensive dashboard.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Business Solutions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          OLORI24 offers comprehensive logistics solutions for businesses of all sizes. From e-commerce fulfillment to corporate deliveries, we've got you covered.
        </p>
        <Button asChild>
          <Link to="/signup?type=business">Create Business Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;