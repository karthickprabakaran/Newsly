import { supabaseAdmin } from '../../../../util/supabase-server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, featureType, subject, description, userId, userEmail } = body;

    // Validate required fields
    if (!name || !userEmail || !subject || !description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { status: 400 }
      );
    }

    // Create a feature request record
    const { data, error } = await supabaseAdmin
      .from('feature_requests')
      .insert([
        {
          user_id: userId,
          name: name.trim(),
          email: userEmail.trim().toLowerCase(),
          request_type: featureType || 'feature',
          subject: subject.trim(),
          description: description.trim(),
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: "Failed to save your request" }), 
        { status: 500 }
      );
    }

    // Log the request for monitoring (you could also send an email here)
    console.log('New feature request:', {
      id: data[0]?.id,
      name,
      email: userEmail,
      type: featureType,
      subject,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        message: "Feature request submitted successfully",
        requestId: data[0]?.id 
      }), 
      { status: 200 }
    );

  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: "Contact API endpoint" }), 
    { status: 200 }
  );
}