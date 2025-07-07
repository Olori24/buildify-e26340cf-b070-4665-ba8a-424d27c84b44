
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple implementation of the Traveling Salesman Problem using nearest neighbor algorithm
function optimizeRoute(start, destinations) {
  // Start with the driver's current location
  const route = [start];
  const unvisited = [...destinations];
  let currentPoint = start;

  // Continue until all destinations are visited
  while (unvisited.length > 0) {
    // Find the nearest unvisited destination
    let nearestIndex = 0;
    let minDistance = calculateDistance(
      currentPoint.latitude, 
      currentPoint.longitude,
      unvisited[0].latitude,
      unvisited[0].longitude
    );

    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(
        currentPoint.latitude,
        currentPoint.longitude,
        unvisited[i].latitude,
        unvisited[i].longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    // Move to the nearest destination
    currentPoint = unvisited[nearestIndex];
    route.push(currentPoint);
    unvisited.splice(nearestIndex, 1);
  }

  return route;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
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

    const { driverId, considerTraffic = true, considerPriority = true } = await req.json()

    if (!driverId) {
      return new Response(
        JSON.stringify({ error: 'Driver ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get driver's current location
    const { data: driver, error: driverError } = await supabaseClient
      .from('drivers')
      .select('id, current_location')
      .eq('id', driverId)
      .single()

    if (driverError || !driver) {
      return new Response(
        JSON.stringify({ error: 'Driver not found', details: driverError?.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Get driver's assigned deliveries
    const { data: assignments, error: assignmentsError } = await supabaseClient
      .from('delivery_assignments')
      .select(`
        id,
        status,
        shipment_id,
        shipments (
          id,
          tracking_number,
          status,
          destination_address,
          is_priority
        )
      `)
      .eq('driver_id', driverId)
      .in('status', ['pending', 'accepted'])
      .order('created_at', { ascending: true })

    if (assignmentsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch assignments', details: assignmentsError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (!assignments || assignments.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending deliveries found for this driver' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract delivery destinations
    const destinations = assignments.map(assignment => {
      const shipment = assignment.shipments;
      const address = typeof shipment.destination_address === 'string' 
        ? JSON.parse(shipment.destination_address) 
        : shipment.destination_address;
      
      return {
        assignment_id: assignment.id,
        shipment_id: shipment.id,
        tracking_number: shipment.tracking_number,
        status: shipment.status,
        is_priority: shipment.is_priority,
        address: address.formatted_address || `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
        latitude: address.latitude,
        longitude: address.longitude
      };
    });

    // Sort destinations by priority if enabled
    if (considerPriority) {
      destinations.sort((a, b) => {
        if (a.is_priority && !b.is_priority) return -1;
        if (!a.is_priority && b.is_priority) return 1;
        return 0;
      });
    }

    // Driver's current location
    const startPoint = {
      latitude: driver.current_location.latitude,
      longitude: driver.current_location.longitude,
      address: 'Current Location'
    };

    // Optimize the route
    const optimizedRoute = optimizeRoute(startPoint, destinations);

    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < optimizedRoute.length - 1; i++) {
      totalDistance += calculateDistance(
        optimizedRoute[i].latitude,
        optimizedRoute[i].longitude,
        optimizedRoute[i + 1].latitude,
        optimizedRoute[i + 1].longitude
      );
    }

    // Simulate traffic adjustment if enabled
    if (considerTraffic) {
      // In a real implementation, this would use real-time traffic data
      // For now, we'll just add a random adjustment
      totalDistance *= (1 + Math.random() * 0.2); // Up to 20% increase due to traffic
    }

    // Calculate estimated time (assuming average speed of 30 km/h in urban areas)
    const estimatedTimeHours = totalDistance / 30;
    const estimatedTimeMinutes = Math.round(estimatedTimeHours * 60);

    return new Response(
      JSON.stringify({
        optimized_route: optimizedRoute,
        total_distance_km: Math.round(totalDistance * 10) / 10,
        estimated_time_minutes: estimatedTimeMinutes,
        considerations: {
          traffic: considerTraffic,
          priority: considerPriority
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