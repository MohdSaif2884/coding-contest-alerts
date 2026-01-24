import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Contest } from '@/services/contestService';

export interface ContestSubscription {
  id: string;
  contest_id: string;
  contest_name: string;
  platform: string;
  start_time: string;
}

export const useContestSubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<ContestSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contest_subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching subscriptions:', error);
      } else {
        setSubscriptions(data || []);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const subscribe = async (contest: Contest) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('contest_subscriptions')
        .insert({
          user_id: user.id,
          contest_id: contest.id,
          contest_name: contest.name,
          platform: contest.platform,
          start_time: contest.startTime.toISOString(),
        });

      if (error) {
        console.error('Error subscribing:', error);
        return { error };
      }

      await fetchSubscriptions();
      return { error: null };
    } catch (err) {
      console.error('Error subscribing:', err);
      return { error: err as Error };
    }
  };

  const unsubscribe = async (contestId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('contest_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('contest_id', contestId);

      if (error) {
        console.error('Error unsubscribing:', error);
        return { error };
      }

      await fetchSubscriptions();
      return { error: null };
    } catch (err) {
      console.error('Error unsubscribing:', err);
      return { error: err as Error };
    }
  };

  const isSubscribed = (contestId: string) => {
    return subscriptions.some((sub) => sub.contest_id === contestId);
  };

  return {
    subscriptions,
    loading,
    subscribe,
    unsubscribe,
    isSubscribed,
    refetch: fetchSubscriptions,
  };
};
