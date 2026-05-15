export default function ScoreRing({
  score,
  size = 160,
  label = "Soil Health",
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#dc2626";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#EDE5D0"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
          style={{ ["--score-offset" as string]: offset }}
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-forest-800"
          style={{
            fontSize: "22px",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            transform: "rotate(90deg)",
            transformOrigin: "50% 50%",
          }}
        >
          {score}
        </text>
      </svg>
      <span className="text-sm font-medium text-soil-400">{label}</span>
    </div>
  );
}
