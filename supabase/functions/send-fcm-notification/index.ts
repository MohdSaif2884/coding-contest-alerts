/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, string>;
}

interface SendNotificationRequest {
  userId?: string;
  token?: string;
  notification: NotificationPayload;
}

async function sendFCMMessage(token: string, notification: NotificationPayload, serverKey: string) {
  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${serverKey}`,
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
      },
      data: notification.data || {},
      webpush: {
        headers: {
          Urgency: 'high',
        },
        notification: {
          title: notification.title,
          body: notification.body,
          icon: notification.icon || '/favicon.ico',
          requireInteraction: true,
        },
      },
    }),
  });

  const result = await response.json();
  console.log('FCM Response:', JSON.stringify(result));
  return result;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serverKey = Deno.env.get('FIREBASE_SERVER_KEY');
    if (!serverKey) {
      console.error('FIREBASE_SERVER_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'FCM not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, token, notification }: SendNotificationRequest = await req.json();

    if (!notification || !notification.title || !notification.body) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing notification title or body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const results: { token: string; success: boolean; error?: string }[] = [];

    // If direct token provided, send to that token
    if (token) {
      try {
        const result = await sendFCMMessage(token, notification, serverKey);
        results.push({ token, success: result.success === 1, error: result.results?.[0]?.error });
      } catch (error) {
        console.error('Error sending to token:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({ token, success: false, error: errorMessage });
      }
    }

    // If userId provided, fetch all tokens for that user
    if (userId) {
      const { data: tokens, error: fetchError } = await supabase
        .from('fcm_tokens')
        .select('token')
        .eq('user_id', userId);

      if (fetchError) {
        console.error('Error fetching tokens:', fetchError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch user tokens' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      if (tokens && tokens.length > 0) {
        for (const { token: userToken } of tokens) {
          try {
            const result = await sendFCMMessage(userToken, notification, serverKey);
            const sendSuccess = result.success === 1;
            results.push({ token: userToken, success: sendSuccess, error: result.results?.[0]?.error });

            // If token is invalid, remove it from database
            if (result.results?.[0]?.error === 'NotRegistered' || result.results?.[0]?.error === 'InvalidRegistration') {
              await supabase
                .from('fcm_tokens')
                .delete()
                .eq('token', userToken);
              console.log('Removed invalid token:', userToken.substring(0, 20) + '...');
            }
          } catch (error) {
            console.error('Error sending to user token:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            results.push({ token: userToken, success: false, error: errorMessage });
          }
        }
      } else {
        console.log('No FCM tokens found for user:', userId);
      }
    }

    if (!token && !userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Either userId or token is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`Sent ${successCount}/${results.length} notifications successfully`);

    return new Response(
      JSON.stringify({ 
        success: successCount > 0, 
        sent: successCount, 
        total: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in send-fcm-notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
