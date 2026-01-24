import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPreferences {
  reminder_60m: boolean;
  reminder_30m: boolean;
  reminder_10m: boolean;
  reminder_live: boolean;
  notify_whatsapp: boolean;
  notify_push: boolean;
  notify_email: boolean;
  notify_alarm: boolean;
}

const defaultPreferences: UserPreferences = {
  reminder_60m: true,
  reminder_30m: true,
  reminder_10m: true,
  reminder_live: true,
  notify_whatsapp: false,
  notify_push: true,
  notify_email: false,
  notify_alarm: true,
};

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(defaultPreferences);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
      }

      if (data) {
        setPreferences({
          reminder_60m: data.reminder_60m,
          reminder_30m: data.reminder_30m,
          reminder_10m: data.reminder_10m,
          reminder_live: data.reminder_live,
          notify_whatsapp: data.notify_whatsapp,
          notify_push: data.notify_push,
          notify_email: data.notify_email,
          notify_alarm: data.notify_alarm,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreference = async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ [key]: value })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating preference:', error);
        // Revert on error
        setPreferences(preferences);
      }
    } catch (err) {
      console.error('Error updating preference:', err);
      setPreferences(preferences);
    }
  };

  return {
    preferences,
    loading,
    updatePreference,
    refetch: fetchPreferences,
  };
};
