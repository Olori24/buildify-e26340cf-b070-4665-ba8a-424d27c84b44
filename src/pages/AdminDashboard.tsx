
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPackages, updatePackageStatus } from '@/lib/mock-data';
import { Package } from '@/types';
import PackageStatusBadge from '@/components/PackageStatusBadge';
import { format } from 'date-fns';
import { ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const data = getAllPackages();
      setPackages(data);
      setFilteredPackages(data);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = packages;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(pkg => pkg.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(pkg => 
        pkg.trackingNumber.toLowerCase().includes(query) ||
        pkg.recipient.name.toLowerCase().includes(query) ||
        pkg.recipient.city.toLowerCase().includes(query) ||
        pkg.sender.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredPackages(result);
  }, [packages, searchQuery, statusFilter]);

  const handleUpdateStatus = (trackingNumber: string, newStatus: Package['status']) => {
    // Get the package
    const pkg = packages.find(p => p.trackingNumber === trackingNumber);
    if (!pkg) return;
    
    // Get the current location from the most recent event
    const sortedEvents = [...pkg.trackingHistory].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const currentLocation = sortedEvents[0].location;
    
    // Generate appropriate description based on status
    let description = '';
    switch (newStatus) {
      case 'in-transit':
        description = 'Package is in transit to the next facility';
        break;
      case 'out-for-delivery':
        description = 'Package is out for delivery';
        break;
      case 'delivered':
        description = 'Package has been delivered';
        break;
      case 'exception':
        description = 'There is an issue with the delivery';
        break;
      default:
        description = 'Package status has been updated';
    }
    
    // Update the package status
    const updatedPackage = updatePackageStatus(trackingNumber, newStatus, currentLocation, description);
    
    if (updatedPackage) {
      // Update the packages state
      setPackages(prevPackages => 
        prevPackages.map(p => p.trackingNumber === trackingNumber ? updatedPackage : p)
      );
      
      toast({
        title: "Status Updated",
        description: `Package ${trackingNumber} status updated to ${newStatus}`,
      });
    }
  };

  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = getAllPackages();
      setPackages(data);
      setFilteredPackages(data);
      setLoading(false);
      
      toast({
        title: "Data Refreshed",
        description: "Package data has been refreshed",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={refreshData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Packages</CardTitle>
              <CardDescription>All packages in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{packages.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>In Transit</CardTitle>
              <CardDescription>Packages currently in transit</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {packages.filter(pkg => pkg.status === 'in-transit').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Delivered Today</CardTitle>
              <CardDescription>Packages delivered today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {packages.filter(pkg => 
                  pkg.status === 'delivered' && 
                  pkg.trackingHistory.some(event => 
                    event.status === 'Delivered' && 
                    new Date(event.timestamp).toDateString() === new Date().toDateString()
                  )
                ).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <h2 className="text-xl font-semibold">Package Management</h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search packages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="exception">Exception</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Est. Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading packages...
                    </TableCell>
                  </TableRow>
                ) : filteredPackages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No packages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">
                        <Link to={`/track/${pkg.trackingNumber}`} className="text-primary hover:underline">
                          {pkg.trackingNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{pkg.recipient.name}</TableCell>
                      <TableCell>{pkg.origin}</TableCell>
                      <TableCell>{pkg.destination}</TableCell>
                      <TableCell>{format(new Date(pkg.estimatedDelivery), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <PackageStatusBadge status={pkg.status} />
                      </TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={pkg.status}
                          onValueChange={(value) => handleUpdateStatus(pkg.trackingNumber, value as Package['status'])}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-transit">In Transit</SelectItem>
                            <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="exception">Exception</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;