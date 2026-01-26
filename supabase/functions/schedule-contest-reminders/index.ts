/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContestSubscription {
  id: string;
  user_id: string;
  contest_id: string;
  contest_name: string;
  platform: string;
  start_time: string;
}

interface UserPreferences {
  user_id: string;
  reminder_10m: boolean;
  reminder_30m: boolean;
  reminder_60m: boolean;
  reminder_live: boolean;
  notify_push: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const checkWindows = [
      { minutes: 60, label: '60m', prefKey: 'reminder_60m' },
      { minutes: 30, label: '30m', prefKey: 'reminder_30m' },
      { minutes: 10, label: '10m', prefKey: 'reminder_10m' },
      { minutes: 0, label: 'live', prefKey: 'reminder_live' },
    ];

    const notificationsSent: { userId: string; contestName: string; offset: string }[] = [];

    for (const window of checkWindows) {
      // Calculate the time window for this reminder (±2 minutes tolerance)
      const targetTime = new Date(now.getTime() + window.minutes * 60 * 1000);
      const windowStart = new Date(targetTime.getTime() - 2 * 60 * 1000);
      const windowEnd = new Date(targetTime.getTime() + 2 * 60 * 1000);

      // Fetch subscriptions for contests starting in this window
      const { data: subscriptions, error: subError } = await supabase
        .from('contest_subscriptions')
        .select('*')
        .gte('start_time', windowStart.toISOString())
        .lte('start_time', windowEnd.toISOString());

      if (subError) {
        console.error(`Error fetching subscriptions for ${window.label}:`, subError);
        continue;
      }

      if (!subscriptions || subscriptions.length === 0) {
        console.log(`No subscriptions found for ${window.label} window`);
        continue;
      }

      console.log(`Found ${subscriptions.length} subscriptions for ${window.label} window`);

      // Group by user to batch preference lookups
      const userIds = [...new Set(subscriptions.map((s: ContestSubscription) => s.user_id))];

      // Fetch user preferences
      const { data: preferences, error: prefError } = await supabase
        .from('user_preferences')
        .select('user_id, reminder_10m, reminder_30m, reminder_60m, reminder_live, notify_push')
        .in('user_id', userIds);

      if (prefError) {
        console.error('Error fetching preferences:', prefError);
        continue;
      }

      const prefMap = new Map<string, UserPreferences>();
      (preferences || []).forEach((p: UserPreferences) => prefMap.set(p.user_id, p));

      // Send notifications for each subscription
      for (const sub of subscriptions as ContestSubscription[]) {
        const userPref = prefMap.get(sub.user_id);
        
        // Check if user has this reminder enabled and push notifications on
        if (!userPref || !userPref.notify_push) {
          console.log(`User ${sub.user_id} has push disabled`);
          continue;
        }

        const reminderEnabled = userPref[window.prefKey as keyof UserPreferences] as boolean;
        if (!reminderEnabled) {
          console.log(`User ${sub.user_id} has ${window.label} reminder disabled`);
          continue;
        }

        // Send FCM notification
        const notificationBody = window.minutes === 0
          ? `${sub.contest_name} is LIVE NOW on ${sub.platform}! 🚀`
          : `${sub.contest_name} starts in ${window.minutes} minutes on ${sub.platform}!`;

        try {
          const response = await fetch(`${supabaseUrl}/functions/v1/send-fcm-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              userId: sub.user_id,
              notification: {
                title: `🔔 ${sub.contest_name}`,
                body: notificationBody,
                data: {
                  contestId: sub.contest_id,
                  platform: sub.platform,
                  type: 'contest_reminder',
                },
              },
            }),
          });

          const result = await response.json();
          if (result.success) {
            notificationsSent.push({
              userId: sub.user_id,
              contestName: sub.contest_name,
              offset: window.label,
            });
          }
          console.log(`Notification result for ${sub.contest_name}:`, result);
        } catch (error) {
          console.error(`Error sending notification for ${sub.contest_name}:`, error);
        }
      }
    }

    console.log(`Total notifications sent: ${notificationsSent.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationsSent: notificationsSent.length,
        details: notificationsSent,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in schedule-contest-reminders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
