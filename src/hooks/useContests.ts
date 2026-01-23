import { useState, useEffect, useCallback } from 'react';
import { contestService, Contest } from '@/services/contestService';

export function useContests(refreshInterval = 60000) {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchContests = useCallback(async () => {
    try {
      setError(null);
      const data = await contestService.fetchAllContests();
      setContests(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch contests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContests();
    
    // Auto-refresh
    const interval = setInterval(fetchContests, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchContests, refreshInterval]);

  const upcomingContests = contests.filter(c => c.isUpcoming);
  const liveContests = contests.filter(c => c.isLive);

  // Add timeUntilStart to each contest
  const contestsWithTime = contests.map(c => ({
    ...c,
    timeUntilStart: contestService.getTimeUntilStart(c)
  }));

  return {
    contests: contestsWithTime,
    upcomingContests: contestsWithTime.filter(c => c.isUpcoming),
    liveContests: contestsWithTime.filter(c => c.isLive),
    loading,
    error,
    lastUpdated,
    refresh: fetchContests
  };
}
