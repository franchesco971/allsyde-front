import { Card } from "@/app/components/ui/card";
import { CheckCheck } from "lucide-react";

export default function RiskDashboardSource() {
  return (
    <Card className="p-5 bg-muted/30">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">
            Sources connectées
          </h4>
          <p className="text-xs text-muted-foreground">
            Organismes de contrôle & surveillance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {["Apave", "Bureau Veritas", "Dekra", "Watchdog"].map((source) => (
            <div
              key={source}
              className="flex items-center space-x-2 px-3 py-2 bg-background rounded-lg"
            >
              <CheckCheck className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-foreground">
                {source}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
