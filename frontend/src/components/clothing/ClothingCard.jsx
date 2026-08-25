import { useState } from "react"
import { formalityBadge, seasonBadge, capitalize } from "../../utils/helpers"

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e8e0d0' width='200' height='200'/%3E%3Ctext fill='%23c4a882' font-family='serif' font-size='48' x='50%25' y='55%25' text-anchor='middle' dominant-baseline='middle'%3E👕%3C/text%3E%3C/svg%3E"

export default function ClothingCard({ item, onDelete }) {
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return }
    await onDelete(item._id)
  }

  return (
    <div className="card-hover group flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-warm overflow-hidden">
        <img
          src={item.imageUrl || PLACEHOLDER}
          alt={item.name || item.type}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <span className={formalityBadge(item.formalityLevel)}>{item.formalityLevel}</span>
        </div>
        {item.wearCount > 0 && (
          <div className="absolute bottom-2 left-2 badge bg-ink/70 text-parch backdrop-blur-sm">
            Worn {item.wearCount}×
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm capitalize">
              {item.name || capitalize(item.type)}
            </p>
            <p className="text-xs text-stone-500 capitalize">{item.color} · {item.pattern}</p>
          </div>
          <span className={seasonBadge(item.season)}>{item.season}</span>
        </div>

        {/* Delete */}
        <button
          onClick={handleDelete}
          onBlur={() => setConfirming(false)}
          className={`mt-auto text-xs py-1.5 rounded-lg transition-colors font-medium ${
            confirming
              ? "bg-red-500 text-white hover:bg-red-600"
              : "text-stone-400 hover:text-red-500 hover:bg-red-50"
          }`}
        >
          {confirming ? "Confirm delete?" : "Remove"}
        </button>
      </div>
    </div>
  )
}
