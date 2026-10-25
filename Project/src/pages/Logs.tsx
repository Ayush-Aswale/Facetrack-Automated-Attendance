import { useEffect, useState } from "react";
import { Calendar, User, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface AttendanceLog {
  id: string;
  check_in_time: string;
  status: string;
  user: {
    name: string;
    department: string | null;
  };
}

const Logs = () => {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AttendanceLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchLogs();
  }, [selectedDate]);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, logs]);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select(
          `
          id,
          check_in_time,
          status,
          users (name, department)
        `
        )
        .gte("check_in_time", `${selectedDate}T00:00:00`)
        .lte("check_in_time", `${selectedDate}T23:59:59`)
        .order("check_in_time", { ascending: false });

      if (error) throw error;

      const formattedLogs = (data || []).map((log: any) => ({
        id: log.id,
        check_in_time: log.check_in_time,
        status: log.status,
        user: {
          name: log.users?.name || "Unknown",
          department: log.users?.department || null,
        },
      }));

      setLogs(formattedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to load attendance logs");
    }
  };

  const filterLogs = () => {
    if (!searchTerm) {
      setFilteredLogs(logs);
      return;
    }

    const filtered = logs.filter((log) =>
      log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLogs(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Attendance Logs
          </h1>
          <p className="text-muted-foreground">
            View and search attendance records
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Search</span>
                </label>
                <Input
                  type="text"
                  placeholder="Search by name or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Attendance Records ({filteredLogs.length} entries)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">
                    No attendance records found
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {log.user.name}
                        </h3>
                        {log.user.department && (
                          <p className="text-sm text-muted-foreground">
                            {log.user.department}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {format(new Date(log.check_in_time), "hh:mm a")}
                          </span>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                        {log.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;
