import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Bell, BellOff, Calendar, Clock, Filter, Loader2, Radio, RefreshCw, Search, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContests } from "@/hooks/useContests";
import { Contest, contestService } from "@/services/contestService";
import { alarmService } from "@/services/alarmService";
import { toast } from "sonner";

const platforms = ["All", "Codeforces", "LeetCode", "AtCoder", "CodeChef"];
const difficulties = ["All", "Easy", "Medium", "Hard", "Mixed"];

const platformColors: Record<string, string> = {
  Codeforces: "from-red-500 to-orange-500",
  LeetCode: "from-yellow-500 to-orange-500",
  AtCoder: "from-gray-700 to-gray-500",
  CodeChef: "from-amber-600 to-yellow-500",
};

const platformLogos: Record<string, string> = {
  Codeforces: "CF",
  LeetCode: "LC",
  AtCoder: "AC",
  CodeChef: "CC",
};

const Contests = () => {
  const { contests, loading, error, lastUpdated, refresh, liveContests } = useContests();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [subscribedContests, setSubscribedContests] = useState<Set<string>>(new Set());
  const [alarmPermission, setAlarmPermission] = useState(false);

  useEffect(() => {
    // Check alarm permission on mount
    alarmService.requestPermissions().then(setAlarmPermission);
    
    // Load subscribed contests from localStorage
    const saved = localStorage.getItem('subscribedContests');
    if (saved) {
      setSubscribedContests(new Set(JSON.parse(saved)));
    }
  }, []);

  const filteredContests = contests.filter((contest) => {
    const matchesSearch = contest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === "All" || contest.platform === selectedPlatform;
    const matchesDifficulty = selectedDifficulty === "All" || contest.difficulty === selectedDifficulty;
    return matchesSearch && matchesPlatform && matchesDifficulty;
  });

  const toggleSubscription = async (contest: Contest) => {
    const newSubscribed = new Set(subscribedContests);
    
    if (subscribedContests.has(contest.id)) {
      // Unsubscribe
      newSubscribed.delete(contest.id);
      const alarmId = parseInt(contest.id.replace(/\D/g, '')) || Math.random() * 10000;
      await alarmService.cancelAlarm(alarmId);
      toast.success(`${contest.name} से unsubscribe किया`);
    } else {
      // Subscribe
      newSubscribed.add(contest.id);
      
      if (!alarmPermission) {
        const granted = await alarmService.requestPermissions();
        setAlarmPermission(granted);
        if (!granted) {
          toast.error("Alarm permission denied. Please enable notifications.");
          return;
        }
      }

      // Schedule alarms for 60m, 30m, 10m before
      const offsets = [60, 30, 10, 0];
      for (const offset of offsets) {
        const alarmId = parseInt(contest.id.replace(/\D/g, '')) * 10 + offset;
        await alarmService.scheduleContestAlarm({
          id: alarmId,
          contestId: contest.id,
          contestName: contest.name,
          platform: contest.platform,
          startTime: contest.startTime,
          reminderOffset: offset
        });
      }
      
      toast.success(`🔔 ${contest.name} के लिए alarm set!`, {
        description: "Contest शुरू होने से पहले alarm बजेगा"
      });
    }
    
    setSubscribedContests(newSubscribed);
    localStorage.setItem('subscribedContests', JSON.stringify([...newSubscribed]));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPlatform("All");
    setSelectedDifficulty("All");
  };

  const hasActiveFilters = searchQuery || selectedPlatform !== "All" || selectedDifficulty !== "All";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-display-sm font-bold mb-2">
                  Contest Explorer 🔔
                </h1>
                <p className="text-muted-foreground">
                  Subscribe करो, alarm बजेगा! Live data from Codeforces, LeetCode, AtCoder & more.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {lastUpdated && (
                  <span className="text-xs text-muted-foreground">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refresh}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Live Contests Banner */}
          {liveContests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-red-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="font-semibold text-red-400">LIVE NOW</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {liveContests.map(c => (
                    <Badge key={c.id} variant="destructive" className="animate-pulse">
                      {c.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-4 md:p-6 border border-border/50 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search contests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50"
                />
              </div>
              <div className="flex gap-4">
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-[160px] bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[140px] bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <Button variant="ghost" size="icon" onClick={clearFilters}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && contests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading live contests...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-10">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={refresh}>Try Again</Button>
            </div>
          )}

          {/* Contest Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest, index) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                className="group"
              >
                <div className={`glass rounded-2xl p-6 h-full border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  subscribedContests.has(contest.id) 
                    ? 'border-primary/50 shadow-primary/10 shadow-lg' 
                    : 'border-border/50 hover:border-primary/30 hover:shadow-primary/5'
                }`}>
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platformColors[contest.platform] || 'from-primary to-accent'} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {platformLogos[contest.platform] || contest.platform.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {contest.isLive && (
                          <Badge variant="destructive" className="animate-pulse text-xs">
                            <Radio className="w-3 h-3 mr-1" />
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold line-clamp-2">{contest.name}</h3>
                      <p className="text-sm text-muted-foreground">{contest.platform}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Starts in</span>
                      <span className="font-semibold text-primary">
                        {contestService.getTimeUntilStart(contest)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">
                        {contest.startTime.toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {contest.difficulty && (
                        <Badge variant="secondary">{contest.difficulty}</Badge>
                      )}
                      {subscribedContests.has(contest.id) && (
                        <Badge variant="default" className="bg-primary/20 text-primary">
                          <Volume2 className="w-3 h-3 mr-1" />
                          Alarm Set
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    className={`w-full ${subscribedContests.has(contest.id) ? 'glow-primary-sm' : ''}`}
                    variant={subscribedContests.has(contest.id) ? "default" : "outline"}
                    onClick={() => toggleSubscription(contest)}
                  >
                    {subscribedContests.has(contest.id) ? (
                      <>
                        <BellOff className="w-4 h-4 mr-2" />
                        Alarm Cancel करें
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 mr-2" />
                        Alarm Set करें 🔔
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredContests.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No contests found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contests;
