
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { supabase } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  LogOut, 
  Package, 
  Plus, 
  Home, 
  Bell, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Search
} from 'lucide-react';
import TrackingForm from './TrackingForm';

const AppNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };
    
    checkUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  // Don't show navbar on tracking page
  if (location.pathname.startsWith('/track/')) {
    return null;
  }

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="md" variant="full" />
            </Link>
            <nav className="hidden lg:flex gap-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/solutions" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith('/solutions') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Solutions
              </Link>
              <Link 
                to="/pricing" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/pricing' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Pricing
              </Link>
              <Link 
                to="/carriers" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/carriers' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Carriers
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/contact' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {loading ? (
              <div className="h-9 w-24 bg-muted rounded-md animate-pulse"></div>
            ) : user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/create-shipment">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Shipment
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 text-sm border-b">
                        <div className="font-medium">Shipment status updated</div>
                        <div className="text-muted-foreground">Your shipment OLR-20250707-12345 is now in transit</div>
                        <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                      </div>
                      <div className="p-4 text-sm">
                        <div className="font-medium">Delivery scheduled</div>
                        <div className="text-muted-foreground">Your shipment OLR-20250706-54321 will be delivered tomorrow</div>
                        <div className="text-xs text-muted-foreground mt-1">Yesterday</div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button variant="ghost" size="sm" className="w-full justify-center">
                        View all notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden lg:inline">{user.user_metadata?.full_name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer w-full flex items-center">
                        <Home className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/shipments" className="cursor-pointer w-full flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        My Shipments
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/analytics" className="cursor-pointer w-full flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer w-full flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-sm font-medium py-2 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/solutions" 
                className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link 
                to="/pricing" 
                className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/carriers" 
                className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Carriers
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t">
                {user ? (
                  <div className="space-y-4">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link 
                      to="/shipments" 
                      className="flex items-center text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      My Shipments
                    </Link>
                    <Link 
                      to="/create-shipment" 
                      className="flex items-center text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Shipment
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start p-0 h-auto text-sm font-medium text-red-600 hover:text-red-700 hover:bg-transparent"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link 
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="w-full">
                      <Link 
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
      
      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Quick Track</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSearchOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <TrackingForm variant="embedded" />
          </div>
        </div>
      )}
    </header>
  );
};

export default AppNavbar;

export default AppNavbar;