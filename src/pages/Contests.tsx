import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Bell, Calendar, Clock, Filter, Search, X } from "lucide-react";
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

const allContests = [
  {
    id: 1,
    name: "Codeforces Round #912 (Div. 2)",
    platform: "Codeforces",
    logo: "CF",
    color: "from-red-500 to-orange-500",
    startTime: "2024-01-20T14:35:00Z",
    timeUntil: "2h 30m",
    duration: "2h",
    difficulty: "Div. 2",
    participants: "15k+",
    subscribed: true,
  },
  {
    id: 2,
    name: "LeetCode Weekly Contest 378",
    platform: "LeetCode",
    logo: "LC",
    color: "from-yellow-500 to-orange-500",
    startTime: "2024-01-21T02:30:00Z",
    timeUntil: "1d 4h",
    duration: "1h 30m",
    difficulty: "Mixed",
    participants: "25k+",
    subscribed: true,
  },
  {
    id: 3,
    name: "AtCoder Beginner Contest 335",
    platform: "AtCoder",
    logo: "AC",
    color: "from-gray-700 to-gray-500",
    startTime: "2024-01-22T12:00:00Z",
    timeUntil: "2d 12h",
    duration: "1h 40m",
    difficulty: "ABC",
    participants: "12k+",
    subscribed: false,
  },
  {
    id: 4,
    name: "CodeChef Starters 117",
    platform: "CodeChef",
    logo: "CC",
    color: "from-amber-600 to-yellow-500",
    startTime: "2024-01-23T14:30:00Z",
    timeUntil: "3d 8h",
    duration: "2h",
    difficulty: "Div. 2+3",
    participants: "8k+",
    subscribed: false,
  },
  {
    id: 5,
    name: "Codeforces Round #913 (Div. 3)",
    platform: "Codeforces",
    logo: "CF",
    color: "from-red-500 to-orange-500",
    startTime: "2024-01-24T14:35:00Z",
    timeUntil: "4d 2h",
    duration: "2h 15m",
    difficulty: "Div. 3",
    participants: "20k+",
    subscribed: false,
  },
  {
    id: 6,
    name: "LeetCode Biweekly Contest 121",
    platform: "LeetCode",
    logo: "LC",
    color: "from-yellow-500 to-orange-500",
    startTime: "2024-01-25T14:30:00Z",
    timeUntil: "5d 4h",
    duration: "1h 30m",
    difficulty: "Mixed",
    participants: "18k+",
    subscribed: false,
  },
  {
    id: 7,
    name: "TopCoder SRM 850",
    platform: "TopCoder",
    logo: "TC",
    color: "from-blue-600 to-blue-400",
    startTime: "2024-01-26T20:00:00Z",
    timeUntil: "6d 10h",
    duration: "1h 15m",
    difficulty: "SRM",
    participants: "2k+",
    subscribed: false,
  },
  {
    id: 8,
    name: "HackerRank Week of Code",
    platform: "HackerRank",
    logo: "HR",
    color: "from-green-600 to-emerald-500",
    startTime: "2024-01-27T00:00:00Z",
    timeUntil: "7d",
    duration: "7d",
    difficulty: "Mixed",
    participants: "10k+",
    subscribed: false,
  },
];

const platforms = ["All", "Codeforces", "LeetCode", "AtCoder", "CodeChef", "TopCoder", "HackerRank"];
const difficulties = ["All", "Div. 1", "Div. 2", "Div. 3", "Mixed", "ABC", "SRM"];

const Contests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [contests, setContests] = useState(allContests);

  const filteredContests = contests.filter((contest) => {
    const matchesSearch = contest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === "All" || contest.platform === selectedPlatform;
    const matchesDifficulty = selectedDifficulty === "All" || contest.difficulty === selectedDifficulty;
    return matchesSearch && matchesPlatform && matchesDifficulty;
  });

  const toggleSubscription = (id: number) => {
    setContests(contests.map(c => 
      c.id === id ? { ...c, subscribed: !c.subscribed } : c
    ));
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
            <h1 className="text-3xl md:text-display-sm font-bold mb-2">Contest Explorer</h1>
            <p className="text-muted-foreground">Discover and subscribe to upcoming coding contests across all platforms.</p>
          </motion.div>

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
                <div className="glass rounded-2xl p-6 h-full border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${contest.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {contest.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold mb-1 line-clamp-2">{contest.name}</h3>
                      <p className="text-sm text-muted-foreground">{contest.platform}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Starts in</span>
                      <span className="font-semibold">{contest.timeUntil}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{contest.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{contest.difficulty}</Badge>
                      <Badge variant="outline">{contest.participants} registered</Badge>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    className={`w-full ${contest.subscribed ? 'glow-primary-sm' : ''}`}
                    variant={contest.subscribed ? "default" : "outline"}
                    onClick={() => toggleSubscription(contest.id)}
                  >
                    {contest.subscribed ? (
                      <>
                        <Bell className="w-4 h-4 mr-2" />
                        Subscribed
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredContests.length === 0 && (
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
