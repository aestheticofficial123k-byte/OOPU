export default function EmptyState({ icon = "🪣", title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4 opacity-50">{icon}</div>
      <h3 className="font-display text-xl text-stone-500 mb-1">{title}</h3>
      {desc && <p className="text-sm text-stone-400 mb-5 max-w-xs">{desc}</p>}
      {action}
    </div>
  )
}
