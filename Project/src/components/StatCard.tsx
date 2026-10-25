import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold text-foreground mt-2">{value}</h3>
            {trend && (
              <p
                className={`text-sm mt-2 ${
                  trendUp ? "text-accent" : "text-destructive"
                }`}
              >
                {trend}
              </p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-xl">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
