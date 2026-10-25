import { useEffect, useState } from "react";
import { Users, Calendar, CheckCircle, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayAttendance: 0,
    presentToday: 0,
    avgAttendance: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // Get today's attendance
      const today = new Date().toISOString().split("T")[0];
      const { data: todayAttendance } = await supabase
        .from("attendance")
        .select("*")
        .gte("check_in_time", `${today}T00:00:00`)
        .lte("check_in_time", `${today}T23:59:59`);

      setStats({
        totalUsers: totalUsers || 0,
        todayAttendance: todayAttendance?.length || 0,
        presentToday: todayAttendance?.length || 0,
        avgAttendance: totalUsers ? Math.round(((todayAttendance?.length || 0) / totalUsers) * 100) : 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard statistics");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Attendance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time overview of attendance tracking system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Registered"
            value={stats.totalUsers}
            icon={Users}
            trend="+12% from last month"
            trendUp={true}
          />
          <StatCard
            title="Today's Check-ins"
            value={stats.todayAttendance}
            icon={Calendar}
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={CheckCircle}
            trend={`${stats.avgAttendance}% attendance rate`}
            trendUp={stats.avgAttendance > 75}
          />
          <StatCard
            title="Active Sessions"
            value={stats.todayAttendance}
            icon={Clock}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-md p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <a
                href="/enroll"
                className="flex items-center p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
              >
                <Users className="h-6 w-6 text-primary mr-3" />
                <div>
                  <p className="font-medium text-foreground">Enroll New User</p>
                  <p className="text-sm text-muted-foreground">
                    Register a new face for attendance tracking
                  </p>
                </div>
              </a>
              <a
                href="/attendance"
                className="flex items-center p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-colors border border-accent/20"
              >
                <CheckCircle className="h-6 w-6 text-accent mr-3" />
                <div>
                  <p className="font-medium text-foreground">Mark Attendance</p>
                  <p className="text-sm text-muted-foreground">
                    Scan faces to record attendance
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-md p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Camera Status</span>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  Ready
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Database</span>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Recognition Model</span>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
