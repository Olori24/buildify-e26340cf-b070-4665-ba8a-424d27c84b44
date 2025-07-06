
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

const AppNavbar = () => {
  const location = useLocation();
  
  // Don't show navbar on tracking page
  if (location.pathname.startsWith('/track/')) {
    return null;
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="md" variant="full" />
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                Home
              </Link>
              <Link to="/services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Services
              </Link>
              <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">Admin</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/">Track Package</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;