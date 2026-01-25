import { supabase } from '@/integrations/supabase/client';

export interface Contest {
  id: string;
  name: string;
  platform: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  link: string;
  difficulty?: string;
  isLive: boolean;
  isUpcoming: boolean;
}

interface ApiContest {
  id: string;
  name: string;
  platform: string;
  startTime: string;
  endTime: string;
  duration: number;
  link: string;
  status: string;
}

class ContestService {
  private cache: Map<string, { data: Contest[]; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async fetchAllContests(): Promise<Contest[]> {
    const cached = this.getFromCache('all');
    if (cached) return cached;

    try {
      // Call the edge function for real API data
      const { data, error } = await supabase.functions.invoke('fetch-contests');
      
      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.success || !data?.data) {
        console.warn('No contest data received, using fallback');
        return this.getFallbackContests();
      }

      const contests: Contest[] = data.data
        .filter((c: ApiContest) => c.name && c.startTime)
        .map((c: ApiContest) => {
          const startTime = new Date(c.startTime);
          const endTime = c.endTime ? new Date(c.endTime) : new Date(startTime.getTime() + (c.duration || 7200) * 1000);
          const now = Date.now();
          
          return {
            id: c.id,
            name: c.name,
            platform: this.normalizePlatform(c.platform),
            startTime,
            endTime,
            duration: c.duration || Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
            link: c.link,
            difficulty: this.inferDifficulty(c.name, c.platform),
            isLive: c.status === 'LIVE' || (startTime.getTime() <= now && endTime.getTime() > now),
            isUpcoming: c.status === 'UPCOMING' || startTime.getTime() > now,
          };
        })
        .filter((c: Contest) => c.isLive || c.isUpcoming);

      // Sort by start time
      contests.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

      this.setCache('all', contests);
      console.log(`Loaded ${contests.length} contests from API`);
      return contests;
    } catch (error) {
      console.error('Error fetching contests:', error);
      return this.getFallbackContests();
    }
  }

  private normalizePlatform(platform: string): string {
    const normalized = platform.toLowerCase();
    if (normalized.includes('leetcode')) return 'LeetCode';
    if (normalized.includes('codeforces')) return 'Codeforces';
    if (normalized.includes('codechef')) return 'CodeChef';
    if (normalized.includes('atcoder')) return 'AtCoder';
    return platform;
  }

  private inferDifficulty(name: string, _platform: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('div. 1') || lowerName.includes('div.1')) return 'Hard';
    if (lowerName.includes('div. 2') || lowerName.includes('div.2')) return 'Medium';
    if (lowerName.includes('div. 3') || lowerName.includes('div.3') || lowerName.includes('beginner')) return 'Easy';
    if (lowerName.includes('educational') || lowerName.includes('abc')) return 'Easy';
    if (lowerName.includes('agc') || lowerName.includes('arc')) return 'Hard';
    return 'Mixed';
  }

  private getFallbackContests(): Contest[] {
    // Return some reasonable fallback data if API fails
    return [
      {
        id: 'lc-weekly-fallback',
        name: 'Weekly Contest (Check LeetCode for details)',
        platform: 'LeetCode',
        startTime: this.getNextSunday(2, 30),
        endTime: this.getNextSunday(4, 0),
        duration: 5400,
        link: 'https://leetcode.com/contest/',
        difficulty: 'Mixed',
        isLive: false,
        isUpcoming: true
      },
      {
        id: 'cc-starters-fallback',
        name: 'Starters (Check CodeChef for details)',
        platform: 'CodeChef',
        startTime: this.getNextWednesday(20, 0),
        endTime: this.getNextWednesday(22, 0),
        duration: 7200,
        link: 'https://www.codechef.com/contests',
        difficulty: 'Easy',
        isLive: false,
        isUpcoming: true
      },
      {
        id: 'ac-abc-fallback',
        name: 'AtCoder Beginner Contest (Check AtCoder for details)',
        platform: 'AtCoder',
        startTime: this.getNextSaturday(17, 30),
        endTime: this.getNextSaturday(19, 10),
        duration: 6000,
        link: 'https://atcoder.jp/contests/',
        difficulty: 'Easy',
        isLive: false,
        isUpcoming: true
      }
    ];
  }

  private getFromCache(key: string): Contest[] | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: Contest[]): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getNextSunday(hours: number, minutes: number): Date {
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(hours, minutes, 0, 0);
    return nextSunday;
  }

  private getNextSaturday(hours: number, minutes: number): Date {
    const now = new Date();
    const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
    const nextSaturday = new Date(now);
    nextSaturday.setDate(now.getDate() + daysUntilSaturday);
    nextSaturday.setHours(hours, minutes, 0, 0);
    return nextSaturday;
  }

  private getNextWednesday(hours: number, minutes: number): Date {
    const now = new Date();
    const daysUntilWednesday = (3 - now.getDay() + 7) % 7 || 7;
    const nextWednesday = new Date(now);
    nextWednesday.setDate(now.getDate() + daysUntilWednesday);
    nextWednesday.setHours(hours, minutes, 0, 0);
    return nextWednesday;
  }

  getTimeUntilStart(contest: Contest): string {
    const now = Date.now();
    const start = contest.startTime.getTime();
    const diff = start - now;

    if (diff <= 0) return 'LIVE NOW';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}

export const contestService = new ContestService();
