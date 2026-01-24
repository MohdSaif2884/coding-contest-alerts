import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  XCircle,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useContests } from "@/hooks/useContests";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useContestSubscriptions } from "@/hooks/useContestSubscriptions";
import { alarmService } from "@/services/alarmService";
import { toast } from "sonner";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { contests, loading: contestsLoading } = useContests();
  const { preferences, updatePreference } = useUserPreferences();
  const { subscriptions, subscribe, unsubscribe, isSubscribed } = useContestSubscriptions();
  const [isTestingAlarm, setIsTestingAlarm] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Get upcoming contests (next 4)
  const upcomingContests = contests.slice(0, 4);

  // Compute stats
  const stats = [
    { label: "Attended", value: 47, icon: CheckCircle, color: "text-accent", bgColor: "bg-accent/20" },
    { label: "Missed", value: 3, icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/20" },
    { label: "Subscribed", value: subscriptions.length, icon: Calendar, color: "text-primary", bgColor: "bg-primary/20" },
  ];

  const toggleSubscription = async (contest: typeof contests[0]) => {
    if (!user) {
      toast.error("Please login to subscribe to contests");
      navigate('/auth');
      return;
    }

    if (isSubscribed(contest.id)) {
      await unsubscribe(contest.id);
      toast.info("Unsubscribed from contest");
    } else {
      await subscribe(contest);
      toast.success("🔔 Subscribed! You'll be reminded before the contest");
    }
  };

  const testAlarm = async () => {
    setIsTestingAlarm(true);
    
    try {
      const hasPermission = await alarmService.requestPermissions();
      
      if (!hasPermission) {
        toast.error("Please allow notifications to test the alarm");
        setIsTestingAlarm(false);
        return;
      }

      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.7;
      
      await audio.play();
      toast.success("🔔 Alarm Test Playing!", {
        description: "This is how your contest alarm will sound",
        duration: 5000,
      });

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

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container-wide flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Login Required</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to access your dashboard and manage contest subscriptions.
              </p>
              <Button onClick={() => navigate('/auth')} className="glow-primary-sm">
                Sign In
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <h1 className="text-3xl md:text-display-sm font-bold mb-2">
              Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'Coder'}! 👋
            </h1>
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
                      {contestsLoading && (
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
                    {contestsLoading ? (
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
                        const subscribed = isSubscribed(contest.id);
                        
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
                              variant={subscribed ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleSubscription(contest)}
                              className={subscribed ? "glow-primary-sm" : ""}
                            >
                              {subscribed ? (
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm">60 minutes before</span>
                    <Switch
                      checked={preferences.reminder_60m}
                      onCheckedChange={(checked) => updatePreference('reminder_60m', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">30 minutes before</span>
                    <Switch
                      checked={preferences.reminder_30m}
                      onCheckedChange={(checked) => updatePreference('reminder_30m', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">10 minutes before</span>
                    <Switch
                      checked={preferences.reminder_10m}
                      onCheckedChange={(checked) => updatePreference('reminder_10m', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">When contest goes LIVE</span>
                    <Switch
                      checked={preferences.reminder_live}
                      onCheckedChange={(checked) => updatePreference('reminder_live', checked)}
                    />
                  </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <span className="text-sm">WhatsApp</span>
                      <Badge variant="outline" className="text-xs text-primary border-primary/50">
                        PRO
                      </Badge>
                    </div>
                    <Switch
                      checked={preferences.notify_whatsapp}
                      onCheckedChange={() => toast.error("WhatsApp alerts are Pro feature - upgrade to unlock!")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Web Push</span>
                    </div>
                    <Switch
                      checked={preferences.notify_push}
                      onCheckedChange={(checked) => updatePreference('notify_push', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Switch
                      checked={preferences.notify_email}
                      onCheckedChange={(checked) => updatePreference('notify_email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">In-App Alarm</span>
                    </div>
                    <Switch
                      checked={preferences.notify_alarm}
                      onCheckedChange={(checked) => updatePreference('notify_alarm', checked)}
                    />
                  </div>
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
                      <span className="text-muted-foreground">Subscriptions</span>
                      <span className="font-semibold">{subscriptions.length}</span>
                    </div>
                    <Progress value={Math.min(subscriptions.length * 10, 100)} className="h-2" />
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
