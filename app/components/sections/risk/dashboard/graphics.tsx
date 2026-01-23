import { Card } from "@/app/components/ui/card";
import { PieChart } from "lucide-react";
import {
  Cell,
  Pie,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function RiskDashboardGraphics({
  conformityData,
  riskByCategoryData,
}: Readonly<{
  conformityData: { name: string; value: number; color: string }[];
  riskByCategoryData: { category: string; score: number }[];
}>) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Répartition de conformité */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-6">
          État de conformité
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={conformityData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {conformityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {conformityData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Risques par catégorie */}
      <Card className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-6">
          Performance par catégorie
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={riskByCategoryData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="category"
              stroke="hsl(var(--muted-foreground))"
            />
            <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
            <Radar
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
