import { capitalize } from "../../utils/helpers"

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e8e0d0' width='100' height='100'/%3E%3Ctext fill='%23c4a882' font-family='serif' font-size='36' x='50%25' y='55%25' text-anchor='middle' dominant-baseline='middle'%3E?%3C/text%3E%3C/svg%3E"

function ItemThumb({ item, role }) {
  if (!item) return (
    <div className="aspect-square rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
      No {role}
    </div>
  )
  return (
    <div className="aspect-square rounded-xl overflow-hidden bg-warm">
      <img
        src={item.imageUrl || PLACEHOLDER}
        alt={item.name || item.type}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export default function OutfitCard({ outfit, rank }) {
  const { items, score } = outfit
  const medals = ["🥇","🥈","🥉"]

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{medals[rank] ?? "✨"}</span>
          <h3 className="font-display text-lg">Outfit {rank + 1}</h3>
        </div>
        <span className="badge bg-clay/20 text-clay font-medium">Score: {score}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <ItemThumb item={items.top}      role="top" />
        <ItemThumb item={items.bottom}   role="bottom" />
        <ItemThumb item={items.footwear} role="shoes" />
      </div>

      <div className="space-y-1 text-xs text-stone-500">
        {["top","bottom","footwear"].map(role => items[role] && (
          <div key={role} className="flex justify-between">
            <span className="capitalize text-stone-400">{role}</span>
            <span className="font-medium text-stone-700 capitalize">
              {items[role].name || capitalize(items[role].type)} · {items[role].color}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
