
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/supabase

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
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Get the request body
    const { trackingNumber, status, location, description } = await req.json()

    if (!trackingNumber || !status || !location) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get the package
    const { data: packageData, error: packageError } = await supabaseClient
      .from('packages')
      .select('id')
      .eq('tracking_number', trackingNumber)
      .single()

    if (packageError || !packageData) {
      return new Response(
        JSON.stringify({ error: 'Package not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Update the package status
    const { error: updateError } = await supabaseClient
      .from('packages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', packageData.id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update package status' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Add a new tracking event
    const { data: eventData, error: eventError } = await supabaseClient
      .from('tracking_events')
      .insert({
        package_id: packageData.id,
        status,
        location,
        description: description || `Package status updated to ${status}`,
        timestamp: new Date().toISOString()
      })
      .select()

    if (eventError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create tracking event' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Package status updated successfully',
        event: eventData[0]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})