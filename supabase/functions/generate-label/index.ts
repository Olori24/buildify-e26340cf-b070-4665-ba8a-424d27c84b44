
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { 
      userId,
      businessId,
      carrierId,
      originAddress,
      destinationAddress,
      packageDetails,
      weight,
      dimensions,
      isSignatureRequired,
      isPriority,
      notes
    } = await req.json()

    if (!userId || !carrierId || !originAddress || !destinationAddress) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Generate a tracking number
    const { data: trackingNumber, error: trackingError } = await supabaseClient.rpc(
      'generate_tracking_number'
    )

    if (trackingError) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate tracking number', details: trackingError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Calculate shipping cost (simplified for demo)
    const baseRate = 10.00;
    const weightRate = weight * 2.50;
    const priorityRate = isPriority ? 15.00 : 0;
    const signatureRate = isSignatureRequired ? 5.00 : 0;
    const shippingCost = baseRate + weightRate + priorityRate + signatureRate;

    // Calculate estimated delivery (simplified for demo)
    const today = new Date();
    let daysToAdd = 3; // Standard delivery
    
    if (isPriority) {
      daysToAdd = 1; // Priority delivery
    }
    
    const estimatedDelivery = new Date(today);
    estimatedDelivery.setDate(today.getDate() + daysToAdd);

    // Create the shipment
    const { data: shipment, error: shipmentError } = await supabaseClient
      .from('shipments')
      .insert({
        tracking_number: trackingNumber,
        carrier_id: carrierId,
        user_id: userId,
        business_id: businessId,
        status: 'pending',
        estimated_delivery: estimatedDelivery.toISOString(),
        origin_address: originAddress,
        destination_address: destinationAddress,
        package_details: packageDetails,
        weight,
        dimensions,
        shipping_cost: shippingCost,
        is_signature_required: isSignatureRequired,
        is_priority: isPriority,
        notes
      })
      .select()
      .single()

    if (shipmentError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create shipment', details: shipmentError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create initial tracking event
    const { error: eventError } = await supabaseClient
      .from('tracking_events')
      .insert({
        shipment_id: shipment.id,
        status: 'pending',
        location: originAddress.city + ', ' + originAddress.state,
        description: 'Shipping label created',
        timestamp: new Date().toISOString()
      })

    if (eventError) {
      console.error('Failed to create tracking event:', eventError);
      // Continue anyway since the shipment was created successfully
    }

    // Generate a mock shipping label URL
    // In a real implementation, this would call a label generation service
    const labelUrl = `https://api.olori24.com/labels/${trackingNumber}.pdf`;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Shipping label generated successfully',
        shipment: {
          ...shipment,
          label_url: labelUrl
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})