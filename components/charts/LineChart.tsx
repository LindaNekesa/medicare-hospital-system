import React from "react";

interface LineChartProps {
  data: { date: string; value: number }[];
  title: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, color = "#3B82F6" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="h-[250px] flex items-center justify-center text-gray-400">No data available</div>
      </div>
    );
  }

  const maxVal  = Math.max(...data.map(d => d.value), 1);
  const minVal  = Math.min(...data.map(d => d.value), 0);
  const range   = maxVal - minVal || 1;
  const W = 600;
  const H = 200;
  const PAD = { top: 10, right: 20, bottom: 30, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const points = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1 || 1)) * chartW,
    y: PAD.top + chartH - ((d.value - minVal) / range) * chartH,
    label: d.date,
    value: d.value,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: PAD.top + chartH - t * chartH,
    label: Math.round(minVal + t * range),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: "300px", height: "250px" }}>
          {/* Grid lines */}
          {yTicks.map(t => (
            <g key={t.label}>
              <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke="#e5e7eb" strokeWidth="1" />
              <text x={PAD.left - 5} y={t.y + 4} textAnchor="end" fontSize="10" fill="#6b7280">{t.label}</text>
            </g>
          ))}

          {/* Line */}
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

          {/* Area fill */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${PAD.top + chartH} L ${points[0].x} ${PAD.top + chartH} Z`}
            fill={color} fillOpacity="0.08"
          />

          {/* Dots + labels */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill={color} stroke="white" strokeWidth="2" />
              {data.length <= 12 && (
                <text x={p.x} y={H - 5} textAnchor="middle" fontSize="9" fill="#6b7280">
                  {p.label.length > 5 ? p.label.slice(5) : p.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default LineChart;
