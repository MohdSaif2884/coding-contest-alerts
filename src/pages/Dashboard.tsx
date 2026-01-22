import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Bell, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  TrendingUp, 
  Volume2, 
  Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const upcomingContests = [
  {
    id: 1,
    name: "Codeforces Round #912 (Div. 2)",
    platform: "Codeforces",
    logo: "CF",
    color: "from-red-500 to-orange-500",
    startTime: "2h 30m",
    difficulty: "Div. 2",
    subscribed: true,
  },
  {
    id: 2,
    name: "LeetCode Weekly Contest 378",
    platform: "LeetCode",
    logo: "LC",
    color: "from-yellow-500 to-orange-500",
    startTime: "1d 4h",
    difficulty: "Mixed",
    subscribed: true,
  },
  {
    id: 3,
    name: "AtCoder Beginner Contest 335",
    platform: "AtCoder",
    logo: "AC",
    color: "from-gray-700 to-gray-500",
    startTime: "2d 12h",
    difficulty: "ABC",
    subscribed: false,
  },
  {
    id: 4,
    name: "CodeChef Starters 117",
    platform: "CodeChef",
    logo: "CC",
    color: "from-amber-600 to-yellow-500",
    startTime: "3d 8h",
    difficulty: "Div. 2+3",
    subscribed: false,
  },
];

const reminderOffsets = [
  { id: "60min", label: "60 minutes before", enabled: true },
  { id: "30min", label: "30 minutes before", enabled: true },
  { id: "10min", label: "10 minutes before", enabled: false },
  { id: "live", label: "When contest goes LIVE", enabled: true },
];

const notificationChannels = [
  { id: "whatsapp", icon: MessageSquare, label: "WhatsApp", enabled: true, color: "text-green-500" },
  { id: "webpush", icon: Bell, label: "Web Push", enabled: true, color: "text-blue-500" },
  { id: "email", icon: Mail, label: "Email", enabled: false, color: "text-orange-500" },
  { id: "alarm", icon: Volume2, label: "In-App Alarm", enabled: true, color: "text-purple-500" },
];

const stats = [
  { label: "Attended", value: 47, color: "text-accent", bgColor: "bg-accent/20" },
  { label: "Missed", value: 3, color: "text-destructive", bgColor: "bg-destructive/20" },
  { label: "Upcoming", value: 12, color: "text-primary", bgColor: "bg-primary/20" },
];

const Dashboard = () => {
  const [offsets, setOffsets] = useState(reminderOffsets);
  const [channels, setChannels] = useState(notificationChannels);

  const toggleOffset = (id: string) => {
    setOffsets(offsets.map(o => o.id === id ? { ...o, enabled: !o.enabled } : o));
  };

  const toggleChannel = (id: string) => {
    setChannels(channels.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

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
            <h1 className="text-3xl md:text-display-sm font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your contest subscriptions and reminder preferences.</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <Card key={stat.label} className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <TrendingUp className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Contests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="glass border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Upcoming Contests
                    </CardTitle>
                    <CardDescription>Your subscribed contests and recommendations</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingContests.map((contest) => (
                      <div
                        key={contest.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contest.color} flex items-center justify-center text-white font-bold`}>
                          {contest.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{contest.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Starts in {contest.startTime}</span>
                            <Badge variant="secondary" className="text-xs">
                              {contest.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant={contest.subscribed ? "default" : "outline"}
                          size="sm"
                          className={contest.subscribed ? "glow-primary-sm" : ""}
                        >
                          {contest.subscribed ? (
                            <>
                              <Bell className="w-4 h-4 mr-1" />
                              Subscribed
                            </>
                          ) : (
                            "Subscribe"
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Reminder Preferences */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    Reminder Offsets
                  </CardTitle>
                  <CardDescription>When should we remind you?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {offsets.map((offset) => (
                    <div key={offset.id} className="flex items-center justify-between">
                      <span className="text-sm">{offset.label}</span>
                      <Switch
                        checked={offset.enabled}
                        onCheckedChange={() => toggleOffset(offset.id)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Notification Channels */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Smartphone className="w-5 h-5 text-primary" />
                    Notification Channels
                  </CardTitle>
                  <CardDescription>How should we reach you?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <channel.icon className={`w-4 h-4 ${channel.color}`} />
                        <span className="text-sm">{channel.label}</span>
                      </div>
                      <Switch
                        checked={channel.enabled}
                        onCheckedChange={() => toggleChannel(channel.id)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-primary" />
                    This Month
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Attendance Rate</span>
                      <span className="font-semibold text-accent">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Reminders Sent</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
