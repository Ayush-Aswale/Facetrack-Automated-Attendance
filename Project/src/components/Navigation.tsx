import { Link, useLocation } from "react-router-dom";
import { Home, UserPlus, Camera, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/enroll", icon: UserPlus, label: "Enroll" },
    { to: "/attendance", icon: Camera, label: "Mark Attendance" },
    { to: "/logs", icon: Calendar, label: "Logs" },
  ];

  return (
    <nav className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">FaceTrack</span>
          </div>
          <div className="flex space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
