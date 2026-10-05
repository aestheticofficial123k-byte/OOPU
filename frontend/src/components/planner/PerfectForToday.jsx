import { useEffect, useState } from "react"
import { getSuggestions } from "../../api/outfitApi"
import Spinner from "../ui/Spinner"

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%23f7f3ec' width='300' height='300'/%3E%3Ctext fill='%23b8afa3' font-size='50' x='50%25' y='55%25' text-anchor='middle'%3E👕%3C/text%3E%3C/svg%3E"

function ClothingImage({ item, label }) {
  if (!item) return null

  return (
    <div className="aspect-square rounded-2xl overflow-hidden bg-[#F7F4EE]">
      <img
        src={item.imageUrl || PLACEHOLDER}
        alt={item.name || label}
        className="w-full h-full object-contain"
      />
    </div>
  )
}

export default function PerfectForToday() {
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadSuggestion = async () => {
      try {
        setLoading(true)
        setError("")

        const { data } = await getSuggestions()
        const suggestions = data.data || []

        if (suggestions.length > 0) {
          setSuggestion(suggestions[0])
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Add more wardrobe items to get a recommendation."
        )
      } finally {
        setLoading(false)
      }
    }

    loadSuggestion()
  }, [])

  /* ─────────────────────────────────────────────
     LOADING
  ───────────────────────────────────────────── */

  if (loading) {
    return (
      <section className="mt-10">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </section>
    )
  }

  /* ─────────────────────────────────────────────
     EMPTY / ERROR
  ───────────────────────────────────────────── */

  if (error || !suggestion) {
    return (
      <section className="mt-10">
        <div className="rounded-[24px] border border-stone-200 bg-white p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFF1EA] flex items-center justify-center text-lg">
              ✨
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">
                Perfect for today
              </p>

              <h2 className="font-display text-2xl mt-1">
                Let's build a look.
              </h2>

              <p className="text-sm text-stone-500 mt-1">
                {error ||
                  "Add more pieces to your wardrobe and OOPU will find a combination for you."}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const { top, bottom, footwear } = suggestion.items

  return (
    <section className="mt-10">

      {/* ─────────────────────────────────────────
          SECTION HEADER
      ───────────────────────────────────────── */}

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.17em] text-stone-400">
            OOPU pick
          </p>

          <h2 className="font-display text-3xl sm:text-4xl mt-1">
            Perfect for today
          </h2>

          <p className="text-sm text-stone-500 mt-1">
            A look selected from your wardrobe.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF1EA]">
          <span className="text-sm">✨</span>

          <span className="text-xs font-medium text-stone-600">
            Best match
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          MAIN CARD
      ───────────────────────────────────────── */}

      <div className="rounded-[26px] border border-stone-200 bg-white overflow-hidden">

        <div className="grid lg:grid-cols-[1.35fr_0.65fr]">

          {/* OUTFIT PREVIEW */}

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-3 gap-3">
              <ClothingImage
                item={top}
                label="Top"
              />

              <ClothingImage
                item={bottom}
                label="Bottom"
              />

              <ClothingImage
                item={footwear}
                label="Footwear"
              />
            </div>
          </div>

          {/* INFORMATION */}

          <div className="border-t lg:border-t-0 lg:border-l border-stone-100 p-5 sm:p-6 flex flex-col justify-between">

            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-stone-400">
                Recommended look
              </p>

              <h3 className="font-display text-2xl mt-2">
                Clean & Casual
              </h3>

              <p className="text-sm leading-relaxed text-stone-500 mt-3">
                OOPU found this combination from your wardrobe
                based on its overall outfit match.
              </p>

              {/* ITEM TAGS */}

              <div className="flex flex-wrap gap-2 mt-5">
                {top && (
                  <span className="px-3 py-1.5 rounded-full bg-[#F7F4EE] text-xs text-stone-600 capitalize">
                    {top.color || "Top"}
                  </span>
                )}

                {bottom && (
                  <span className="px-3 py-1.5 rounded-full bg-[#F7F4EE] text-xs text-stone-600 capitalize">
                    {bottom.color || "Bottom"}
                  </span>
                )}

                {footwear && (
                  <span className="px-3 py-1.5 rounded-full bg-[#F7F4EE] text-xs text-stone-600 capitalize">
                    {footwear.color || "Footwear"}
                  </span>
                )}
              </div>
            </div>

            {/* ACTION */}

            <button
              type="button"
              className="mt-6 w-full rounded-full bg-[#171513] text-white px-5 py-3 text-sm font-medium hover:bg-black transition"
            >
              Use This Look →
            </button>

          </div>
        </div>

        {/* SCORE */}

        <div className="border-t border-stone-100 px-5 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            OOPU recommendation score
          </span>

          <span className="text-xs font-medium text-stone-600">
            {suggestion.score}
          </span>
        </div>

      </div>
    </section>
  )
}