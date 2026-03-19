export default function StatsItem({ number, label }) {
  return (
    <div>
      <h3 className="text-xl font-bold">{number}</h3>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}