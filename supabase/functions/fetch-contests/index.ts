import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContestHiveContest {
  name: string;
  url: string;
  startTime: string;
  endTime: string;
  duration: number;
  platform: string;
  status: string;
}


Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contests: any[] = [];
    
    // Fetch from Contest-Hive API (aggregates multiple platforms)
    const platforms = ['leetcode', 'codechef', 'atcoder'];
    
    const fetchPromises = platforms.map(async (platform) => {
      try {
        const response = await fetch(`https://contest-hive.vercel.app/api/${platform}`, {
          headers: { 'Accept': 'application/json' },
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch ${platform}: ${response.status}`);
          return [];
        }
        
        const data = await response.json();
        console.log(`${platform} response:`, JSON.stringify(data).slice(0, 500));
        
        // Contest-Hive returns { data: [...contests] } or just an array
        const contestList = data.data || data || [];
        
        return contestList.map((c: ContestHiveContest) => ({
          id: `${platform}-${c.name?.replace(/\s+/g, '-').toLowerCase() || Date.now()}`,
          name: c.name,
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          startTime: c.startTime,
          endTime: c.endTime,
          duration: c.duration,
          link: c.url,
          status: c.status,
        }));
      } catch (error) {
        console.error(`Error fetching ${platform}:`, error);
        return [];
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        contests.push(...result.value);
      }
    }

    // Also try Codeforces direct API
    try {
      const cfResponse = await fetch('https://codeforces.com/api/contest.list');
      const cfData = await cfResponse.json();
      
      if (cfData.status === 'OK') {
        const cfContests = cfData.result
          .filter((c: any) => c.phase === 'BEFORE' || c.phase === 'CODING')
          .slice(0, 20)
          .map((c: any) => ({
            id: `cf-${c.id}`,
            name: c.name,
            platform: 'Codeforces',
            startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
            endTime: new Date((c.startTimeSeconds + c.durationSeconds) * 1000).toISOString(),
            duration: c.durationSeconds,
            link: `https://codeforces.com/contest/${c.id}`,
            status: c.phase === 'CODING' ? 'LIVE' : 'UPCOMING',
          }));
        
        contests.push(...cfContests);
      }
    } catch (error) {
      console.error('Error fetching Codeforces:', error);
    }

    // Sort by start time
    contests.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    console.log(`Total contests fetched: ${contests.length}`);

    return new Response(
      JSON.stringify({ success: true, data: contests }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in fetch-contests:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
