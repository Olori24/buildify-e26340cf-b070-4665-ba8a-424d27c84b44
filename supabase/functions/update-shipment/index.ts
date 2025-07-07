
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

    const { trackingNumber, status, location, description } = await req.json()

    if (!trackingNumber || !status) {
      return new Response(
        JSON.stringify({ error: 'Tracking number and status are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get shipment ID
    const { data: shipment, error: shipmentError } = await supabaseClient
      .from('shipments')
      .select('id')
      .eq('tracking_number', trackingNumber)
      .single()

    if (shipmentError) {
      return new Response(
        JSON.stringify({ error: 'Shipment not found', details: shipmentError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Update shipment status
    const { error: updateError } = await supabaseClient.rpc(
      'update_shipment_status',
      {
        p_shipment_id: shipment.id,
        p_status: status,
        p_location: location || '',
        p_description: description || `Status updated to ${status}`
      }
    )

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update shipment status', details: updateError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get updated shipment with events
    const { data: updatedShipment, error: getError } = await supabaseClient
      .from('shipments')
      .select(`
        id,
        tracking_number,
        status,
        updated_at
      `)
      .eq('id', shipment.id)
      .single()

    const { data: events, error: eventsError } = await supabaseClient
      .from('tracking_events')
      .select('*')
      .eq('shipment_id', shipment.id)
      .order('timestamp', { ascending: false })
      .limit(1)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Shipment status updated successfully',
        shipment: updatedShipment,
        latest_event: events && events.length > 0 ? events[0] : null
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