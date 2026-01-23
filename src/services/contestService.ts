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

interface CodeforcesContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
}

interface _LeetCodeContest {
  title: string;
  titleSlug: string;
  startTime: number;
  duration: number;
}

class ContestService {
  private cache: Map<string, { data: Contest[]; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async fetchAllContests(): Promise<Contest[]> {
    const contests: Contest[] = [];
    
    // Fetch from all platforms in parallel
    const [codeforces, leetcode, codechef, atcoder] = await Promise.allSettled([
      this.fetchCodeforcesContests(),
      this.fetchLeetCodeContests(),
      this.fetchCodeChefContests(),
      this.fetchAtCoderContests()
    ]);

    if (codeforces.status === 'fulfilled') contests.push(...codeforces.value);
    if (leetcode.status === 'fulfilled') contests.push(...leetcode.value);
    if (codechef.status === 'fulfilled') contests.push(...codechef.value);
    if (atcoder.status === 'fulfilled') contests.push(...atcoder.value);

    // Sort by start time
    return contests.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async fetchCodeforcesContests(): Promise<Contest[]> {
    const cached = this.getFromCache('codeforces');
    if (cached) return cached;

    try {
      const response = await fetch('https://codeforces.com/api/contest.list');
      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error('Failed to fetch Codeforces contests');
      }

      const contests: Contest[] = data.result
        .filter((c: CodeforcesContest) => c.phase === 'BEFORE' || c.phase === 'CODING')
        .slice(0, 20)
        .map((c: CodeforcesContest) => {
          const startTime = new Date(c.startTimeSeconds * 1000);
          const endTime = new Date((c.startTimeSeconds + c.durationSeconds) * 1000);
          
          return {
            id: `cf-${c.id}`,
            name: c.name,
            platform: 'Codeforces',
            startTime,
            endTime,
            duration: c.durationSeconds,
            link: `https://codeforces.com/contest/${c.id}`,
            difficulty: c.name.includes('Div. 1') ? 'Hard' : c.name.includes('Div. 2') ? 'Medium' : 'Mixed',
            isLive: c.phase === 'CODING',
            isUpcoming: c.phase === 'BEFORE'
          };
        });

      this.setCache('codeforces', contests);
      return contests;
    } catch (error) {
      console.error('Error fetching Codeforces contests:', error);
      return [];
    }
  }

  async fetchLeetCodeContests(): Promise<Contest[]> {
    const cached = this.getFromCache('leetcode');
    if (cached) return cached;

    try {
      // LeetCode doesn't have a public API, using a proxy or mock data
      // In production, you'd use a backend service to scrape or use unofficial APIs
      const contests: Contest[] = [
        {
          id: 'lc-weekly',
          name: 'Weekly Contest 380',
          platform: 'LeetCode',
          startTime: this.getNextSunday(2, 30), // Sunday 2:30 AM IST
          endTime: this.getNextSunday(4, 0),
          duration: 5400,
          link: 'https://leetcode.com/contest/',
          difficulty: 'Mixed',
          isLive: false,
          isUpcoming: true
        },
        {
          id: 'lc-biweekly',
          name: 'Biweekly Contest 120',
          platform: 'LeetCode',
          startTime: this.getNextSaturday(20, 0), // Saturday 8 PM IST
          endTime: this.getNextSaturday(21, 30),
          duration: 5400,
          link: 'https://leetcode.com/contest/',
          difficulty: 'Mixed',
          isLive: false,
          isUpcoming: true
        }
      ];

      this.setCache('leetcode', contests);
      return contests;
    } catch (error) {
      console.error('Error fetching LeetCode contests:', error);
      return [];
    }
  }

  async fetchCodeChefContests(): Promise<Contest[]> {
    const cached = this.getFromCache('codechef');
    if (cached) return cached;

    try {
      // CodeChef API mock - in production use their API
      const contests: Contest[] = [
        {
          id: 'cc-starters',
          name: 'Starters 120',
          platform: 'CodeChef',
          startTime: this.getNextWednesday(20, 0),
          endTime: this.getNextWednesday(22, 0),
          duration: 7200,
          link: 'https://www.codechef.com/START120',
          difficulty: 'Easy',
          isLive: false,
          isUpcoming: true
        }
      ];

      this.setCache('codechef', contests);
      return contests;
    } catch (error) {
      console.error('Error fetching CodeChef contests:', error);
      return [];
    }
  }

  async fetchAtCoderContests(): Promise<Contest[]> {
    const cached = this.getFromCache('atcoder');
    if (cached) return cached;

    try {
      // AtCoder API mock
      const contests: Contest[] = [
        {
          id: 'ac-abc',
          name: 'AtCoder Beginner Contest 340',
          platform: 'AtCoder',
          startTime: this.getNextSaturday(17, 30),
          endTime: this.getNextSaturday(19, 10),
          duration: 6000,
          link: 'https://atcoder.jp/contests/abc340',
          difficulty: 'Easy',
          isLive: false,
          isUpcoming: true
        }
      ];

      this.setCache('atcoder', contests);
      return contests;
    } catch (error) {
      console.error('Error fetching AtCoder contests:', error);
      return [];
    }
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
