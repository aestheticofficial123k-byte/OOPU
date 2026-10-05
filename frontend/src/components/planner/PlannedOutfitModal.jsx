import { useState } from "react"
import { markWorn } from "../../api/plannerApi"
import { formatDate } from "../../utils/helpers"

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f5f1ea' width='200' height='200'/%3E%3Ctext fill='%23b8afa3' font-size='50' x='50%25' y='55%25' text-anchor='middle'%3E👕%3C/text%3E%3C/svg%3E"

function ClothingItem({ item, label }) {
  if (!item) return null

  return (
    <div className="space-y-2">
      <div className="aspect-square rounded-2xl overflow-hidden bg-[#F8F5EF]">
        <img
          src={item.imageUrl || PLACEHOLDER}
          alt={item.name || label}
          className="w-full h-full object-contain"
        />
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-stone-400">
          {label}
        </p>

        <p className="text-sm font-medium text-stone-800 truncate mt-0.5">
          {item.name || item.type || "Clothing item"}
        </p>

        {item.color && (
          <p className="text-xs text-stone-400 capitalize">
            {item.color}
          </p>
        )}
      </div>
    </div>
  )
}

export default function PlannedOutfitModal({
  plan,
  onClose,
  onEdit,
  onSaved,
}) {
  const [wornLoading, setWornLoading] = useState(false)
  const [error, setError] = useState("")

  if (!plan) return null

  const handleMarkWorn = async () => {
    if (plan.worn) return

    setWornLoading(true)
    setError("")

    try {
      await markWorn(plan._id)
      await onSaved?.()
      onClose()
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not mark outfit as worn."
      )
    } finally {
      setWornLoading(false)
    }
  }

  const accessories = Array.isArray(plan.accessories)
    ? plan.accessories.filter(Boolean)
    : []

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FFFDF9] rounded-[28px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition"
        >
          ×
        </button>

        {/* Header */}
        <div className="px-6 sm:px-8 pt-7 pb-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
            Planned outfit
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mt-2">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl text-[#171513]">
                {plan.occasion || "Your Outfit"}
              </h2>

              <p className="text-sm text-stone-500 mt-1">
                {formatDate(new Date(plan.date))}
              </p>
            </div>

            {plan.worn && (
              <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-[#E7F6F0] text-[#4D7668] text-xs font-medium">
                Worn ✓
              </span>
            )}
          </div>
        </div>

        {/* Outfit */}
        <div className="px-6 sm:px-8">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <ClothingItem
              item={plan.topId}
              label="Top"
            />

            <ClothingItem
              item={plan.bottomId}
              label="Bottom"
            />

            <ClothingItem
              item={plan.footwearId}
              label="Footwear"
            />
          </div>

          {/* Accessories */}
          {accessories.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.15em] text-stone-400 mb-3">
                Accessories
              </p>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {accessories.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="aspect-square rounded-xl overflow-hidden bg-[#F8F5EF]"
                  >
                    <img
                      src={item.imageUrl || PLACEHOLDER}
                      alt={item.name || "Accessory"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {plan.notes && (
            <div className="mt-6 p-4 rounded-2xl bg-[#F8F5EF]">
              <p className="text-[11px] uppercase tracking-[0.15em] text-stone-400 mb-1">
                Notes
              </p>

              <p className="text-sm text-stone-600">
                {plan.notes}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 sm:px-8 py-6 mt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50 transition"
          >
            Edit Plan
          </button>

          {!plan.worn && (
            <button
              type="button"
              onClick={handleMarkWorn}
              disabled={wornLoading}
              className="flex-1 rounded-full bg-[#171513] px-5 py-3 text-sm font-medium text-white hover:bg-black transition disabled:opacity-60"
            >
              {wornLoading ? "Marking..." : "Mark as Worn"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}