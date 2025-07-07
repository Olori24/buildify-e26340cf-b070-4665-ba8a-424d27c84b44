
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  Clock, 
  Zap 
} from 'lucide-react';
import TrackingForm from '@/components/TrackingForm';
import Logo from '@/components/Logo';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <Logo size="lg" variant="full" className="mb-8" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              AI-Powered Logistics & Delivery Tracking
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mb-8">
              Olori24 provides superior real-time tracking, predictive analytics, and customer engagement tools that outperform UPS and FedEx.
            </p>
            <div className="max-w-md w-full mx-auto">
              <TrackingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Superior to UPS & FedEx</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover why businesses and customers choose Olori24 over traditional carriers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Real-Time Precision</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Minute-by-minute updates with AI-enhanced ETAs accurate to ±15 minutes, outperforming FedEx's two-hour window.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  AI-driven insights forecast disruptions and optimize routes, reducing costs by up to 15% compared to traditional carriers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Multi-Carrier Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Seamless integration with 600+ global carriers, with automatic carrier detection and switching capabilities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Fraud Prevention</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  AI-powered security detects suspicious activities in real-time, reducing fraud losses more effectively than competitors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Solutions for Every Need</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're an individual, small business, or enterprise, Olori24 has the perfect solution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>For E-commerce</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Branded tracking pages, automated notifications, and seamless integration with your store to enhance customer experience.
                </p>
                <Button asChild variant="outline">
                  <Link to="/solutions/ecommerce">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>For Logistics Providers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Route optimization, driver management, and real-time analytics to streamline operations and reduce costs.
                </p>
                <Button asChild variant="outline">
                  <Link to="/solutions/logistics">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>For Customers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Track all your packages in one place with precise ETAs, proactive notifications, and delivery preferences.
                </p>
                <Button asChild variant="outline">
                  <Link to="/signup">Create Account</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-xl p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Outperform UPS & FedEx?</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Join thousands of businesses that have switched to Olori24 for superior logistics and delivery tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup?type=business">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See why businesses choose Olori24 over traditional carriers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">E-commerce Director, FashionHub</p>
                  </div>
                </div>
                <p className="italic">
                  "Switching to Olori24 reduced our WISMO inquiries by 78% and increased customer satisfaction scores by 45%. The AI-enhanced ETAs are remarkably accurate."
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">Logistics Manager, TechSupply Inc.</p>
                  </div>
                </div>
                <p className="italic">
                  "The predictive analytics have helped us reduce shipping costs by 12% while improving delivery times. The multi-carrier support is seamless and reliable."
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Aisha Oladele</h4>
                    <p className="text-sm text-muted-foreground">CEO, AfriMarket</p>
                  </div>
                </div>
                <p className="italic">
                  "Olori24's fraud prevention features have virtually eliminated our shipping fraud issues. Their route optimization has been a game-changer for our last-mile delivery."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

export default HomePage;