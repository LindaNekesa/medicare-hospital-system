interface Props {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  sub?: string;
}

export default function StatCard({ label, value, icon, color, sub }: Props) {
  return (
    <div className={`rounded-xl p-5 text-white ${color} shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="font-semibold text-sm">{label}</p>
      {sub && <p className="text-xs opacity-80 mt-0.5">{sub}</p>}
    </div>
  );
}
