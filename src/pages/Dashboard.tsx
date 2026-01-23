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
  Volume2, 
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useContests } from "@/hooks/useContests";
import { alarmService } from "@/services/alarmService";
import { toast } from "sonner";

const reminderOffsetsData = [
  { id: "60min", label: "60 minutes before", minutes: 60, enabled: true },
  { id: "30min", label: "30 minutes before", minutes: 30, enabled: true },
  { id: "10min", label: "10 minutes before", minutes: 10, enabled: false },
  { id: "live", label: "When contest goes LIVE", minutes: 0, enabled: true },
];

const notificationChannelsData = [
  { id: "whatsapp", icon: MessageSquare, label: "WhatsApp", enabled: false, color: "text-green-500", pro: true },
  { id: "webpush", icon: Bell, label: "Web Push", enabled: true, color: "text-blue-500", pro: false },
  { id: "email", icon: Mail, label: "Email", enabled: false, color: "text-orange-500", pro: false },
  { id: "alarm", icon: Volume2, label: "In-App Alarm", enabled: true, color: "text-purple-500", pro: false },
];

const Dashboard = () => {
  const { contests, loading: isLoading } = useContests();
  const [offsets, setOffsets] = useState(reminderOffsetsData);
  const [channels, setChannels] = useState(notificationChannelsData);
  const [subscribedContests, setSubscribedContests] = useState<Set<string>>(new Set());
  const [isTestingAlarm, setIsTestingAlarm] = useState(false);

  // Get upcoming contests (next 4)
  const upcomingContests = contests.slice(0, 4);

  // Compute stats
  const stats = [
    { label: "Attended", value: 47, icon: CheckCircle, color: "text-accent", bgColor: "bg-accent/20" },
    { label: "Missed", value: 3, icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/20" },
    { label: "Upcoming", value: contests.length, icon: Calendar, color: "text-primary", bgColor: "bg-primary/20" },
  ];

  const toggleOffset = (id: string) => {
    setOffsets(offsets.map(o => o.id === id ? { ...o, enabled: !o.enabled } : o));
    toast.success(`Reminder ${offsets.find(o => o.id === id)?.enabled ? 'disabled' : 'enabled'}`);
  };

  const toggleChannel = (id: string) => {
    const channel = channels.find(c => c.id === id);
    if (channel?.pro) {
      toast.error("WhatsApp alerts are Pro feature - upgrade to unlock!");
      return;
    }
    setChannels(channels.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
    toast.success(`${channel?.label} ${channel?.enabled ? 'disabled' : 'enabled'}`);
  };

  const toggleSubscription = (contestId: string) => {
    setSubscribedContests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contestId)) {
        newSet.delete(contestId);
        toast.info("Unsubscribed from contest");
      } else {
        newSet.add(contestId);
        toast.success("🔔 Subscribed! You'll be reminded before the contest");
      }
      return newSet;
    });
  };

  const testAlarm = async () => {
    setIsTestingAlarm(true);
    
    try {
      // Request permission first
      const hasPermission = await alarmService.requestPermissions();
      
      if (!hasPermission) {
        toast.error("Please allow notifications to test the alarm");
        setIsTestingAlarm(false);
        return;
      }

      // Play test alarm sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.7;
      
      await audio.play();
      toast.success("🔔 Alarm Test Playing!", {
        description: "This is how your contest alarm will sound",
        duration: 5000,
      });

      // Stop after 5 seconds
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        setIsTestingAlarm(false);
      }, 5000);
      
    } catch (error) {
      console.error("Alarm test failed:", error);
      toast.error("Failed to play alarm. Check your sound settings.");
      setIsTestingAlarm(false);
    }
  };

  const getPlatformStyle = (platform: string) => {
    const styles: Record<string, { color: string; logo: string }> = {
      'Codeforces': { color: 'from-red-500 to-orange-500', logo: 'CF' },
      'LeetCode': { color: 'from-yellow-500 to-orange-500', logo: 'LC' },
      'CodeChef': { color: 'from-amber-600 to-yellow-500', logo: 'CC' },
      'AtCoder': { color: 'from-gray-700 to-gray-500', logo: 'AC' },
    };
    return styles[platform] || { color: 'from-primary to-accent', logo: platform.slice(0, 2).toUpperCase() };
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
            <p className="text-muted-foreground">Track your upcoming contests and performance at a glance.</p>
          </motion.div>

          {/* Alarm Test Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-8"
          >
            <Card className="glass border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">In-App Alarm</h3>
                      <p className="text-sm text-muted-foreground">
                        Test how the alarm will sound on your phone when contest time comes
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={testAlarm}
                    disabled={isTestingAlarm}
                    className="glow-primary-sm bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {isTestingAlarm ? (
                      <>
                        <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
                        Playing...
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 mr-2" />
                        Test Alarm 🔔
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            {stats.map((stat) => (
              <Card key={stat.label} className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Contests - Live Data */}
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
                      {isLoading && (
                        <Badge variant="secondary" className="text-xs animate-pulse">
                          Loading...
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Live data from Codeforces & other platforms</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/contests">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      // Skeleton loader
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 animate-pulse">
                          <div className="w-12 h-12 rounded-xl bg-muted" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                          </div>
                          <div className="h-9 w-24 bg-muted rounded" />
                        </div>
                      ))
                    ) : upcomingContests.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No upcoming contests found
                      </div>
                    ) : (
                      upcomingContests.map((contest) => {
                        const style = getPlatformStyle(contest.platform);
                        const isSubscribed = subscribedContests.has(contest.id);
                        
                        return (
                          <div
                            key={contest.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors"
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center text-white font-bold shrink-0`}>
                              {style.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">{contest.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                                <Clock className="w-3 h-3" />
                                <span>Starts in {contest.timeUntilStart}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {contest.platform}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant={isSubscribed ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleSubscription(contest.id)}
                              className={isSubscribed ? "glow-primary-sm" : ""}
                            >
                              {isSubscribed ? (
                                <>
                                  <Bell className="w-4 h-4 mr-1" />
                                  Subscribed
                                </>
                              ) : (
                                "Subscribe"
                              )}
                            </Button>
                          </div>
                        );
                      })
                    )}
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
                        {channel.pro && (
                          <Badge variant="outline" className="text-xs text-primary border-primary/50">
                            PRO
                          </Badge>
                        )}
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
