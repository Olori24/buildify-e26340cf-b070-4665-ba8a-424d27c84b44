
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

const shippingLabelSchema = z.object({
  // Sender information
  senderName: z.string().min(2, { message: 'Sender name must be at least 2 characters' }),
  senderAddress: z.string().min(5, { message: 'Please enter a valid sender address' }),
  senderPhone: z.string().optional(),
  senderEmail: z.string().email({ message: 'Please enter a valid email address' }).optional().or(z.literal('')),
  
  // Recipient information
  recipientName: z.string().min(2, { message: 'Recipient name must be at least 2 characters' }),
  recipientAddress: z.string().min(5, { message: 'Please enter a valid recipient address' }),
  recipientPhone: z.string().optional(),
  recipientEmail: z.string().email({ message: 'Please enter a valid email address' }).optional().or(z.literal('')),
  
  // Package information
  packageWeight: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Weight must be a positive number',
  }),
  packageDimensions: z.string().optional(),
  serviceType: z.string().min(1, { message: 'Please select a service type' }),
});

type ShippingLabelFormValues = z.infer<typeof shippingLabelSchema>;

const CreateLabelPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        
        // If user exists, try to prefill the form with their information
        if (data.session.user.id) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (!error && userData) {
            // Check if user has a business profile
            const { data: businessData } = await supabase
              .from('business_profiles')
              .select('*')
              .eq('user_id', data.session.user.id)
              .single();
              
            if (businessData) {
              form.setValue('senderName', businessData.business_name);
              form.setValue('senderAddress', businessData.business_address);
              form.setValue('senderPhone', businessData.business_phone || '');
            } else {
              form.setValue('senderName', userData.full_name);
              form.setValue('senderAddress', userData.address || '');
              form.setValue('senderPhone', userData.phone_number || '');
            }
            
            form.setValue('senderEmail', userData.email);
          }
        }
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
      }
    };
    
    checkUser();
  }, [navigate, form]);

  const form = useForm<ShippingLabelFormValues>({
    resolver: zodResolver(shippingLabelSchema),
    defaultValues: {
      senderName: '',
      senderAddress: '',
      senderPhone: '',
      senderEmail: '',
      recipientName: '',
      recipientAddress: '',
      recipientPhone: '',
      recipientEmail: '',
      packageWeight: '',
      packageDimensions: '',
      serviceType: 'standard',
    },
  });

  const onSubmit = async (data: ShippingLabelFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a shipping label',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      // Call the Supabase RPC function to generate a tracking number
      const { data: trackingData, error: trackingError } = await supabase
        .rpc('generate_tracking_number');

      if (trackingError) throw trackingError;

      const trackingNumber = trackingData;
      
      // Calculate shipping cost (simplified for demo)
      const baseRate = 10.00;
      const weightRate = parseFloat(data.packageWeight) * 2.50;
      const shippingCost = baseRate + weightRate;

      // Calculate estimated delivery (simplified for demo)
      const today = new Date();
      let daysToAdd = 3; // Standard delivery
      
      if (data.serviceType === 'express') {
        daysToAdd = 1;
      } else if (data.serviceType === 'economy') {
        daysToAdd = 5;
      }
      
      const estimatedDelivery = new Date(today);
      estimatedDelivery.setDate(today.getDate() + daysToAdd);

      // Create the shipping label
      const { data: labelData, error: labelError } = await supabase
        .from('shipping_labels')
        .insert({
          user_id: user.id,
          tracking_number: trackingNumber,
          sender_name: data.senderName,
          sender_address: data.senderAddress,
          sender_phone: data.senderPhone,
          sender_email: data.senderEmail,
          recipient_name: data.recipientName,
          recipient_address: data.recipientAddress,
          recipient_phone: data.recipientPhone,
          recipient_email: data.recipientEmail,
          package_weight: parseFloat(data.packageWeight),
          package_dimensions: data.packageDimensions,
          service_type: data.serviceType,
          shipping_cost: shippingCost,
          estimated_delivery: estimatedDelivery.toISOString()
        })
        .select();

      if (labelError) throw labelError;

      setTrackingNumber(trackingNumber);
      setSuccess(true);
      
      toast({
        title: 'Shipping label created!',
        description: `Your tracking number is ${trackingNumber}`,
      });
    } catch (error) {
      console.error('Error creating shipping label:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create shipping label. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success && trackingNumber) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Shipping Label Created!</CardTitle>
            <CardDescription>
              Your shipping label has been created successfully.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                Your package is now ready to be shipped. Use the tracking number below to track your shipment.
              </AlertDescription>
            </Alert>
            
            <div className="p-4 bg-muted rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Tracking Number:</div>
              <div className="text-xl font-bold">{trackingNumber}</div>
            </div>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button 
                className="flex-1" 
                onClick={() => navigate(`/track/${trackingNumber}`)}
              >
                Track Package
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => {
                  setSuccess(false);
                  setTrackingNumber(null);
                  form.reset();
                }}
              >
                Create Another Label
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create Shipping Label</CardTitle>
          <CardDescription>
            Fill out the form below to create a new shipping label and get a tracking number.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Sender Information</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe or Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="senderAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Full address including city, state, and postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="senderPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+234 123 456 7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="senderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender Email (Optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Recipient Information</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Smith or Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recipientAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Full address including city, state, and postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recipientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+234 123 456 7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="recipientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Email (Optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jane.smith@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Package Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="packageWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" min="0.1" placeholder="1.5" {...field} />
                          </FormControl>
                          <FormDescription>Enter weight in kilograms</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="packageDimensions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Dimensions (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="30x20x15 cm" {...field} />
                          </FormControl>
                          <FormDescription>Format: LxWxH in centimeters</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="economy">Economy (5-7 days)</SelectItem>
                            <SelectItem value="standard">Standard (2-4 days)</SelectItem>
                            <SelectItem value="express">Express (1-2 days)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the delivery speed that meets your needs
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Label...' : 'Create Shipping Label'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateLabelPage;