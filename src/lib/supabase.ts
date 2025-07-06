
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = 'https://cmpfewkawvszrhdirnsc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcGZld2thd3ZzenJoZGlybnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzQwMjksImV4cCI6MjA2NzQxMDAyOX0.CqtnkoOj3ouzwooRjHx7OgnccbVd08wzmUh9i-rAJZ8';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function getPackageByTrackingNumber(trackingNumber: string) {
  const { data: packageData, error: packageError } = await supabase
    .from('packages')
    .select('*')
    .eq('tracking_number', trackingNumber)
    .single();

  if (packageError || !packageData) {
    return null;
  }

  const { data: events, error: eventsError } = await supabase
    .from('tracking_events')
    .select('*')
    .eq('package_id', packageData.id)
    .order('timestamp', { ascending: false });

  if (eventsError) {
    console.error('Error fetching tracking events:', eventsError);
    return null;
  }

  return {
    id: packageData.id,
    trackingNumber: packageData.tracking_number,
    status: packageData.status,
    estimatedDelivery: packageData.estimated_delivery,
    weight: `${packageData.weight} kg`,
    dimensions: packageData.dimensions,
    sender: {
      name: packageData.sender_name,
      address: packageData.sender_address,
    },
    recipient: {
      name: packageData.recipient_name,
      address: packageData.recipient_address,
    },
    origin: packageData.sender_address.split(',').pop()?.trim() || '',
    destination: packageData.recipient_address.split(',').pop()?.trim() || '',
    trackingHistory: events.map(event => ({
      id: event.id,
      status: event.status,
      location: event.location,
      description: event.description || '',
      timestamp: event.timestamp,
    })),
  };
}

export async function getAllPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching packages:', error);
    return [];
  }

  return data;
}

export async function updatePackageStatus(
  trackingNumber: string, 
  status: string, 
  location: string, 
  description?: string
) {
  try {
    // First get the package ID
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq('tracking_number', trackingNumber)
      .single();

    if (packageError || !packageData) {
      throw new Error('Package not found');
    }

    // Update the package status
    const { error: updateError } = await supabase
      .from('packages')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', packageData.id);

    if (updateError) {
      throw new Error('Failed to update package status');
    }

    // Add a new tracking event
    const { data: eventData, error: eventError } = await supabase
      .from('tracking_events')
      .insert({
        package_id: packageData.id,
        status,
        location,
        description: description || `Package status updated to ${status}`,
        timestamp: new Date().toISOString()
      })
      .select();

    if (eventError) {
      throw new Error('Failed to create tracking event');
    }

    return { 
      success: true, 
      message: 'Package status updated successfully',
      event: eventData[0]
    };
  } catch (error) {
    console.error('Error updating package status:', error);
    throw error;
  }
}