import { getNutrientStatus } from "@/lib/data";

interface NutrientBarProps {
  label: string;
  value: number;
  unit: string;
  type: "ph" | "nitrogen" | "phosphorus" | "potassium" | "oc";
  max?: number;
}

export default function NutrientBar({
  label,
  value,
  unit,
  type,
  max,
}: NutrientBarProps) {
  const status = getNutrientStatus(value, type);
  const defaults: Record<string, number> = {
    ph: 10,
    nitrogen: 3,
    phosphorus: 50,
    potassium: 500,
    oc: 40,
  };
  const barMax = max || defaults[type] || 100;
  const pct = Math.min(100, (value / barMax) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-forest-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-forest-800">
            {value} {unit}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: status.color + "18",
              color: status.color,
            }}
          >
            {status.label}
          </span>
        </div>
      </div>
      <div className="h-2.5 bg-cream-300 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: status.color }}
        />
      </div>
    </div>
  );
}
