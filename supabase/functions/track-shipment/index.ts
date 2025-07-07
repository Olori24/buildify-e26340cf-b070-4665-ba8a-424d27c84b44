
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

    const { trackingNumber } = await req.json()

    if (!trackingNumber) {
      return new Response(
        JSON.stringify({ error: 'Tracking number is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get shipment details
    const { data: shipment, error: shipmentError } = await supabaseClient
      .from('shipments')
      .select(`
        id,
        tracking_number,
        carrier_id,
        external_tracking_number,
        status,
        estimated_delivery,
        actual_delivery,
        origin_address,
        destination_address,
        package_details,
        weight,
        dimensions,
        shipping_cost,
        insurance_amount,
        is_signature_required,
        is_priority,
        notes,
        created_at,
        updated_at,
        carriers (
          name,
          code,
          logo_url
        )
      `)
      .eq('tracking_number', trackingNumber)
      .single()

    if (shipmentError) {
      return new Response(
        JSON.stringify({ error: 'Shipment not found', details: shipmentError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Get tracking events
    const { data: events, error: eventsError } = await supabaseClient
      .from('tracking_events')
      .select('*')
      .eq('shipment_id', shipment.id)
      .order('timestamp', { ascending: false })

    if (eventsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch tracking events', details: eventsError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get proof of delivery if available
    const { data: pod, error: podError } = await supabaseClient
      .from('proof_of_delivery')
      .select('*')
      .eq('shipment_id', shipment.id)
      .maybeSingle()

    // Calculate ETA with AI-enhanced precision
    let enhancedETA = shipment.estimated_delivery
    
    // In a real implementation, this would use ML models to predict more accurate ETAs
    // based on historical data, current traffic, weather conditions, etc.
    // For now, we'll just add a simple adjustment
    if (shipment.status === 'in_transit' && events.length > 0) {
      // Simulate an AI-enhanced ETA calculation
      const lastEvent = events[0]
      const currentDate = new Date()
      const estimatedDate = new Date(shipment.estimated_delivery)
      
      // Adjust ETA based on current status and events
      if (lastEvent.status === 'in_transit' && lastEvent.description?.includes('delay')) {
        // Add delay if there's a delay mentioned
        estimatedDate.setHours(estimatedDate.getHours() + 2)
        enhancedETA = estimatedDate.toISOString()
      } else if (lastEvent.status === 'out_for_delivery') {
        // More precise delivery window when out for delivery
        const deliveryHour = 8 + Math.floor(Math.random() * 8) // Between 8 AM and 4 PM
        estimatedDate.setHours(deliveryHour, 0, 0, 0)
        enhancedETA = estimatedDate.toISOString()
      }
    }

    // Return the combined data
    return new Response(
      JSON.stringify({
        shipment: {
          ...shipment,
          enhanced_eta: enhancedETA
        },
        events,
        proof_of_delivery: pod || null
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