export default function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-gray-50 px-4 py-3">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-lg font-semibold text-gray-800">{value}</span>
    </div>
  )
}
