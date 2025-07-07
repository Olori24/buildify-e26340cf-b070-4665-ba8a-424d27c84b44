
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail 
} from 'lucide-react';

const AppFooter = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Logo size="md" variant="full" />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Olori24 provides AI-powered logistics and delivery tracking solutions that outperform UPS and FedEx, offering superior real-time visibility, predictive analytics, and customer engagement tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/solutions/ecommerce" className="text-muted-foreground hover:text-primary transition-colors">
                  E-commerce Tracking
                </Link>
              </li>
              <li>
                <Link to="/solutions/logistics" className="text-muted-foreground hover:text-primary transition-colors">
                  Logistics Management
                </Link>
              </li>
              <li>
                <Link to="/solutions/last-mile" className="text-muted-foreground hover:text-primary transition-colors">
                  Last-Mile Delivery
                </Link>
              </li>
              <li>
                <Link to="/solutions/analytics" className="text-muted-foreground hover:text-primary transition-colors">
                  Predictive Analytics
                </Link>
              </li>
              <li>
                <Link to="/solutions/api" className="text-muted-foreground hover:text-primary transition-colors">
                  API Integration
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-muted-foreground hover:text-primary transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/resources/documentation" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/resources/api" className="text-muted-foreground hover:text-primary transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/resources/status" className="text-muted-foreground hover:text-primary transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link to="/resources/support" className="text-muted-foreground hover:text-primary transition-colors">
                  Support Center
                </Link>
              </li>
              <li>
                <Link to="/resources/carriers" className="text-muted-foreground hover:text-primary transition-colors">
                  Supported Carriers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
              <Link to="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Security
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Subscribe to our newsletter:</div>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="rounded-r-none w-auto max-w-[200px]"
                />
                <Button className="rounded-l-none" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Olori24. All rights reserved. Outperforming UPS and FedEx with AI-powered logistics.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;

export default AppFooter;