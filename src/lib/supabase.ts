
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { Shipment, TrackingEvent, Address, Carrier, ProofOfDelivery } from '@/types';

const supabaseUrl = 'https://cmpfewkawvszrhdirnsc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcGZld2thd3ZzenJoZGlybnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzQwMjksImV4cCI6MjA2NzQxMDAyOX0.CqtnkoOj3ouzwooRjHx7OgnccbVd08wzmUh9i-rAJZ8';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
  try {
    // Get shipment details
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select(`
        *,
        carriers (
          id,
          name,
          code,
          logo_url
        )
      `)
      .eq('tracking_number', trackingNumber)
      .single();

    if (shipmentError || !shipment) {
      console.error('Error fetching shipment:', shipmentError);
      return null;
    }

    // Get tracking events
    const { data: events, error: eventsError } = await supabase
      .from('tracking_events')
      .select('*')
      .eq('shipment_id', shipment.id)
      .order('timestamp', { ascending: false });

    if (eventsError) {
      console.error('Error fetching tracking events:', eventsError);
      return null;
    }

    // Get proof of delivery if available
    const { data: pod, error: podError } = await supabase
      .from('proof_of_delivery')
      .select('*')
      .eq('shipment_id', shipment.id)
      .maybeSingle();

    if (podError) {
      console.error('Error fetching proof of delivery:', podError);
    }

    // Transform the data to match our types
    const carrier: Carrier | undefined = shipment.carriers ? {
      id: shipment.carriers.id,
      name: shipment.carriers.name,
      code: shipment.carriers.code,
      logoUrl: shipment.carriers.logo_url || undefined
    } : undefined;

    const originAddress = shipment.origin_address as unknown as Address;
    const destinationAddress = shipment.destination_address as unknown as Address;

    const trackingHistory: TrackingEvent[] = events.map(event => ({
      id: event.id,
      shipmentId: event.shipment_id,
      status: event.status,
      location: event.location || undefined,
      description: event.description || undefined,
      timestamp: event.timestamp,
      createdAt: event.created_at
    }));

    const proofOfDelivery: ProofOfDelivery | undefined = pod ? {
      id: pod.id,
      shipmentId: pod.shipment_id,
      driverId: pod.driver_id || undefined,
      signatureUrl: pod.signature_url || undefined,
      photoUrl: pod.photo_url || undefined,
      recipientName: pod.recipient_name || undefined,
      notes: pod.notes || undefined,
      timestamp: pod.timestamp,
      createdAt: pod.created_at
    } : undefined;

    // Call the edge function to get AI-enhanced ETA
    let enhancedETA = shipment.estimated_delivery;
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/track-shipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ trackingNumber })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.shipment?.enhanced_eta) {
          enhancedETA = data.shipment.enhanced_eta;
        }
      }
    } catch (error) {
      console.error('Error fetching enhanced ETA:', error);
    }

    return {
      id: shipment.id,
      trackingNumber: shipment.tracking_number,
      carrier,
      externalTrackingNumber: shipment.external_tracking_number || undefined,
      status: shipment.status as Shipment['status'],
      estimatedDelivery: shipment.estimated_delivery || '',
      enhancedETA,
      actualDelivery: shipment.actual_delivery || undefined,
      originAddress,
      destinationAddress,
      packageDetails: shipment.package_details,
      weight: shipment.weight || undefined,
      weightUnit: 'kg',
      dimensions: shipment.dimensions as any,
      shippingCost: shipment.shipping_cost || undefined,
      insuranceAmount: shipment.insurance_amount || undefined,
      isSignatureRequired: shipment.is_signature_required,
      isPriority: shipment.is_priority,
      notes: shipment.notes || undefined,
      createdAt: shipment.created_at,
      updatedAt: shipment.updated_at,
      trackingHistory,
      proofOfDelivery
    };
  } catch (error) {
    console.error('Error in getShipmentByTrackingNumber:', error);
    return null;
  }
}

export async function getUserShipments(userId: string): Promise<Shipment[]> {
  try {
    // Get all shipments for the user
    const { data: shipments, error: shipmentsError } = await supabase
      .from('shipments')
      .select(`
        *,
        carriers (
          id,
          name,
          code,
          logo_url
        )
      `)
      .or(`user_id.eq.${userId},business_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (shipmentsError || !shipments) {
      console.error('Error fetching shipments:', shipmentsError);
      return [];
    }

    // Transform the data to match our types
    const result: Shipment[] = await Promise.all(shipments.map(async (shipment) => {
      // Get the latest tracking event for each shipment
      const { data: events, error: eventsError } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('shipment_id', shipment.id)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (eventsError) {
        console.error('Error fetching tracking events:', eventsError);
        return null;
      }

      const carrier: Carrier | undefined = shipment.carriers ? {
        id: shipment.carriers.id,
        name: shipment.carriers.name,
        code: shipment.carriers.code,
        logoUrl: shipment.carriers.logo_url || undefined
      } : undefined;

      const originAddress = shipment.origin_address as unknown as Address;
      const destinationAddress = shipment.destination_address as unknown as Address;

      const trackingHistory: TrackingEvent[] = events.map(event => ({
        id: event.id,
        shipmentId: event.shipment_id,
        status: event.status,
        location: event.location || undefined,
        description: event.description || undefined,
        timestamp: event.timestamp,
        createdAt: event.created_at
      }));

      return {
        id: shipment.id,
        trackingNumber: shipment.tracking_number,
        carrier,
        externalTrackingNumber: shipment.external_tracking_number || undefined,
        status: shipment.status as Shipment['status'],
        estimatedDelivery: shipment.estimated_delivery || '',
        actualDelivery: shipment.actual_delivery || undefined,
        originAddress,
        destinationAddress,
        packageDetails: shipment.package_details,
        weight: shipment.weight || undefined,
        weightUnit: 'kg',
        dimensions: shipment.dimensions as any,
        shippingCost: shipment.shipping_cost || undefined,
        insuranceAmount: shipment.insurance_amount || undefined,
        isSignatureRequired: shipment.is_signature_required,
        isPriority: shipment.is_priority,
        notes: shipment.notes || undefined,
        createdAt: shipment.created_at,
        updatedAt: shipment.updated_at,
        trackingHistory
      };
    }));

    return result.filter(Boolean) as Shipment[];
  } catch (error) {
    console.error('Error in getUserShipments:', error);
    return [];
  }
}

export async function updateShipmentStatus(
  trackingNumber: string, 
  status: string, 
  location: string, 
  description?: string
) {
  try {
    // First get the shipment ID
    const { data: shipmentData, error: shipmentError } = await supabase
      .from('shipments')
      .select('id')
      .eq('tracking_number', trackingNumber)
      .single();

    if (shipmentError || !shipmentData) {
      throw new Error('Shipment not found');
    }

    // Call the RPC function to update status
    const { error: rpcError } = await supabase.rpc('update_shipment_status', {
      p_shipment_id: shipmentData.id,
      p_status: status,
      p_location: location,
      p_description: description
    });

    if (rpcError) {
      throw new Error(`Failed to update shipment status: ${rpcError.message}`);
    }

    return { 
      success: true, 
      message: 'Shipment status updated successfully'
    };
  } catch (error) {
    console.error('Error updating shipment status:', error);
    throw error;
  }
}

export async function createShipment(shipmentData: Partial<Shipment>) {
  try {
    // Generate a tracking number
    const { data: trackingNumber, error: trackingError } = await supabase
      .rpc('generate_tracking_number');

    if (trackingError) {
      throw new Error(`Failed to generate tracking number: ${trackingError.message}`);
    }

    // Prepare the shipment data
    const newShipment = {
      tracking_number: trackingNumber,
      carrier_id: shipmentData.carrier?.id,
      external_tracking_number: shipmentData.externalTrackingNumber,
      user_id: shipmentData.userId,
      business_id: shipmentData.businessId,
      status: 'pending',
      estimated_delivery: shipmentData.estimatedDelivery,
      origin_address: shipmentData.originAddress,
      destination_address: shipmentData.destinationAddress,
      package_details: shipmentData.packageDetails,
      weight: shipmentData.weight,
      dimensions: shipmentData.dimensions,
      shipping_cost: shipmentData.shippingCost,
      insurance_amount: shipmentData.insuranceAmount,
      is_signature_required: shipmentData.isSignatureRequired || false,
      is_priority: shipmentData.isPriority || false,
      notes: shipmentData.notes
    };

    // Create the shipment
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .insert(newShipment)
      .select()
      .single();

    if (shipmentError) {
      throw new Error(`Failed to create shipment: ${shipmentError.message}`);
    }

    // Create initial tracking event
    const { error: eventError } = await supabase
      .from('tracking_events')
      .insert({
        shipment_id: shipment.id,
        status: 'pending',
        location: shipmentData.originAddress?.formatted || 'Origin',
        description: 'Shipment created and pending processing',
        timestamp: new Date().toISOString()
      });

    if (eventError) {
      console.error('Error creating initial tracking event:', eventError);
    }

    return {
      success: true,
      trackingNumber,
      shipmentId: shipment.id
    };
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
}

export async function getNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}