
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PackageStatusBadge } from '@/components/PackageStatusBadge';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [shippingLabels, setShippingLabels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        fetchUserData(data.session.user.id);
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
      }
    };
    
    checkUser();
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    try {
      // Fetch shipping labels created by the user
      const { data: labelsData, error: labelsError } = await supabase
        .from('shipping_labels')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (labelsError) throw labelsError;
      setShippingLabels(labelsData || []);

      // Fetch packages associated with the user's shipping labels
      if (labelsData && labelsData.length > 0) {
        const trackingNumbers = labelsData.map(label => label.tracking_number);
        
        const { data: packagesData, error: packagesError } = await supabase
          .from('packages')
          .select('*, tracking_events(*)')
          .in('tracking_number', trackingNumbers)
          .order('created_at', { ascending: false });

        if (packagesError) throw packagesError;
        setPackages(packagesData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || 'User'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/create-label">Create New Label</Link>
          </Button>
          
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{packages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {packages.filter(pkg => 
                pkg.status === 'In Transit' || 
                pkg.status === 'Processing' || 
                pkg.status === 'Out for Delivery'
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {packages.filter(pkg => pkg.status === 'Delivered').length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="shipments" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="shipments">My Shipments</TabsTrigger>
          <TabsTrigger value="labels">Shipping Labels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>
                Track and manage your recent shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading shipments...</div>
              ) : packages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any shipments yet.</p>
                  <Button asChild>
                    <Link to="/create-label">Create Your First Shipment</Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking Number</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">{pkg.tracking_number}</TableCell>
                          <TableCell>{pkg.recipient_name}</TableCell>
                          <TableCell>
                            <PackageStatusBadge status={pkg.status} />
                          </TableCell>
                          <TableCell>
                            {format(new Date(pkg.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/track/${pkg.tracking_number}`}>
                                Track
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="labels">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Labels</CardTitle>
              <CardDescription>
                View and manage your created shipping labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading labels...</div>
              ) : shippingLabels.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't created any shipping labels yet.</p>
                  <Button asChild>
                    <Link to="/create-label">Create Your First Label</Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking Number</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shippingLabels.map((label) => (
                        <TableRow key={label.id}>
                          <TableCell className="font-medium">{label.tracking_number}</TableCell>
                          <TableCell>{label.sender_name}</TableCell>
                          <TableCell>{label.recipient_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {label.service_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(label.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/track/${label.tracking_number}`}>
                                Track
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/create-label">Create New Label</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;