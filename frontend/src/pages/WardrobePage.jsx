import { useState } from "react"
import { Link } from "react-router-dom"
import { useClothing } from "../hooks/useClothing"
import { useAuth } from "../context/AuthContext"

import ClothingCard from "../components/clothing/ClothingCard"
import ClothingFilters from "../components/clothing/ClothingFilters"
import Spinner from "../components/ui/Spinner"
import Alert from "../components/ui/Alert"

export default function WardrobePage() {
  const [filters, setFilters] = useState({})
  const [search, setSearch] = useState("")

  const { user } = useAuth()
  const { items, loading, error, removeItem } = useClothing(filters)

  const displayName = user?.name || "Your Wardrobe"

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const avatarColor = user?.avatarColor || "#CDEDEA"

  // First 5 items = onboarding progress
  const progress = Math.min(items.length / 5, 1)
  const progressPercent = Math.round(progress * 100)

  // Temporary client-side search
  const visibleItems = items.filter(item => {
    if (!search.trim()) return true

    const query = search.toLowerCase()

    return (
      item.name?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.color?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-[#FFF4E3] text-[#171513]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* ───────────────── HEADER ───────────────── */}
        <div className="flex items-start justify-between gap-4 mb-7 sm:mb-10">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-stone-400 mb-2">
              Your collection
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-none">
              My Wardrobe
            </h1>

            <p className="text-stone-500 mt-2 text-sm sm:text-base">
              Your collection, your style.
            </p>
          </div>

          <Link
            to="/add"
            className="
              shrink-0
              bg-[#171513] text-white
              rounded-full
              px-4 py-3 sm:px-6 sm:py-3.5
              text-sm sm:text-base font-semibold
              hover:scale-[1.02]
              transition-transform
            "
          >
            <span className="sm:hidden">+</span>
            <span className="hidden sm:inline">+ Add Item</span>
          </Link>
        </div>


        {/* ───────────────── COMPACT PROFILE ───────────────── */}
        <section
          className="
            bg-white/75
            border border-white
            rounded-[24px]
            px-4 py-4 sm:px-5 sm:py-5
            shadow-[0_8px_30px_rgba(23,21,19,0.03)]
            mb-5
          "
        >
          <div className="flex items-center justify-between gap-4">

            {/* User */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                  w-12 h-12 sm:w-14 sm:h-14
                  shrink-0
                  rounded-full
                  border-[3px] border-[#20B2AA]
                  flex items-center justify-center
                  font-display text-lg sm:text-xl
                "
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>

              <div className="min-w-0">
                <h2 className="font-display text-lg sm:text-xl truncate">
                  {displayName}
                </h2>

                <p className="text-xs sm:text-sm text-stone-500 truncate">
                  {user?.username
                    ? `@${user.username}`
                    : "Build your digital wardrobe"}
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="hidden sm:flex items-center gap-5 shrink-0">
              <MiniStat value={items.length} label="Items" />
              <MiniStat value="0" label="Outfits" />
              <MiniStat value="0" label="Looks" />
            </div>

            {/* Mobile item count */}
            <div className="sm:hidden text-right shrink-0">
              <div className="font-display text-xl">
                {items.length}
              </div>
              <div className="text-[10px] text-stone-400">
                items
              </div>
            </div>

          </div>


          {/* Small progress */}
          {items.length < 5 && (
            <div className="mt-4 pt-3 border-t border-stone-100">

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-stone-500">
                  Wardrobe progress
                </span>

                <span className="text-[11px] font-medium text-[#FF8066]">
                  {items.length}/5
                </span>
              </div>

              <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF8066] rounded-full transition-all"
                  style={{
                    width: `${Math.max(progressPercent, 4)}%`,
                  }}
                />
              </div>

            </div>
          )}
        </section>


        {/* ───────────────── QUICK FEATURES ───────────────── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">

          <FeatureButton
            icon="♡"
            label="Liked"
            bg="#FFE8E2"
            color="#FF8066"
          />

          <FeatureButton
            icon="♡"
            label="Mood Board"
            bg="#E1F5F2"
            color="#20B2AA"
          />

          <FeatureButton
            icon="▥"
            label="Most Worn"
            bg="#FFF1C9"
            color="#D79B00"
          />

        </div>


        {/* ───────────────── ADD 5 ITEMS ───────────────── */}
        {items.length < 5 && (
          <Link
            to="/add"
            className="
              group
              block
              bg-[#FFF0E9]
              border border-[#FFD8CA]
              rounded-[20px]
              px-4 py-4 sm:px-5 sm:py-4
              mb-6
              hover:border-[#FF8066]
              transition-colors
            "
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  shrink-0
                  w-10 h-10
                  rounded-xl
                  bg-[#FFDCCF]
                  flex items-center justify-center
                  text-xl
                "
              >
                👕
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">
                    <h3 className="font-display text-base sm:text-lg">
                      Add 5 items
                    </h3>

                    <p className="text-xs text-stone-500 mt-0.5">
                      {items.length} of 5 added
                    </p>
                  </div>

                  <span className="text-lg group-hover:translate-x-1 transition-transform">
                    →
                  </span>

                </div>

                <div className="mt-2 h-1 bg-white/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF8066] rounded-full transition-all"
                    style={{
                      width: `${Math.max(progressPercent, 4)}%`,
                    }}
                  />
                </div>

              </div>

            </div>
          </Link>
        )}


        {/* ───────────────── SEARCH + FILTERS ───────────────── */}
        <section className="mb-7">

          <div className="relative mb-3">
            <span
              className="
                absolute left-4 top-1/2 -translate-y-1/2
                text-xl text-stone-400
              "
            >
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your wardrobe..."
              className="
                w-full
                bg-white
                border border-stone-200
                rounded-2xl
                pl-12 pr-4
                py-4
                text-sm
                outline-none
                focus:border-[#20B2AA]
                transition-colors
              "
            />
          </div>

          <div
            className="
              bg-white/70
              rounded-2xl
              p-3
              overflow-x-auto
            "
          >
            <ClothingFilters
              filters={filters}
              onChange={setFilters}
            />
          </div>
        </section>


        {/* Error */}
        <Alert message={error} type="error" />


        {/* ───────────────── CONTENT ───────────────── */}
        {loading ? (

          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>

        ) : visibleItems.length > 0 ? (

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {visibleItems.map(item => (
              <ClothingCard
                key={item._id}
                item={item}
                onDelete={removeItem}
              />
            ))}
          </div>

        ) : items.length === 0 ? (

          <>
            {/* ───────── EMPTY WARDROBE ───────── */}

            <section className="text-center">

              <div className="relative max-w-xl mx-auto">

                <div
                  className="
                    absolute
                    w-28 h-28
                    rounded-full
                    bg-[#FFE680]/50
                    -left-4 top-10
                    blur-sm
                  "
                />

                <div
                  className="
                    absolute
                    w-32 h-32
                    rounded-full
                    bg-[#B9A0FF]/25
                    right-0 top-20
                    blur-sm
                  "
                />

                <img
                  src="/images/wardrobe-empty.png"
                  alt="Wardrobe inspiration"
                  className="
                    relative
                    w-full
                    max-w-[420px]
                    mx-auto
                    object-contain
                    drop-shadow-[0_18px_25px_rgba(23,21,19,0.08)]
                  "
                />
              </div>

              <div className="mt-2 sm:mt-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#20B2AA] mb-3">
                  Same pieces. New possibilities.
                </p>

                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">
                  Your wardrobe is empty
                </h2>

                <p className="text-stone-500 mt-3 max-w-md mx-auto text-sm sm:text-base">
                  Start adding your favourite pieces and build your
                  digital wardrobe.
                </p>

                <Link
                  to="/add"
                  className="
                    inline-flex items-center gap-3
                    mt-6
                    bg-[#171513]
                    text-white
                    rounded-full
                    px-7 py-4
                    font-semibold
                    hover:scale-[1.02]
                    transition-transform
                  "
                >
                  Add Your First Item
                  <span>→</span>
                </Link>
              </div>

            </section>


            {/* ───────── OOPU JOURNEY ───────── */}

            <section
              className="
                bg-white/80
                border border-white
                rounded-[28px]
                p-5 sm:p-7
                mt-12
              "
            >
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-400 mb-2">
                  The OOPU experience
                </p>

                <h2 className="font-display text-2xl sm:text-3xl">
                  From wardrobe to more
                </h2>

                <p className="text-sm text-stone-500 mt-1">
                  Add your pieces and unlock the full experience.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">

                <JourneyStep
                  icon="👕"
                  title="Build"
                  text="Your wardrobe"
                  bg="#FFE8E2"
                />

                <JourneyStep
                  icon="♧"
                  title="Create"
                  text="Outfits"
                  bg="#E1F5F2"
                />

                <JourneyStep
                  icon="▣"
                  title="Plan"
                  text="Your looks"
                  bg="#FFF1C9"
                />

                <JourneyStep
                  icon="▥"
                  title="Discover"
                  text="Style insights"
                  bg="#EEE7FF"
                />

              </div>
            </section>
          </>

        ) : (

          /* Search produced no results */
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⌕</div>

            <h2 className="font-display text-2xl">
              Nothing found
            </h2>

            <p className="text-sm text-stone-500 mt-2">
              Try a different search or clear your filters.
            </p>
          </div>

        )}

      </div>
    </div>
  )
}


/* ───────────────── COMPONENTS ───────────────── */

function MiniStat({ value, label }) {
  return (
    <div className="text-center">
      <div className="font-display text-lg">
        {value}
      </div>

      <div className="text-[10px] text-stone-400 mt-0.5">
        {label}
      </div>
    </div>
  )
}


function FeatureButton({ icon, label, bg, color }) {
  return (
    <button
      type="button"
      className="
        flex items-center justify-center
        gap-2
        rounded-xl
        py-2.5
        px-2
        hover:scale-[1.01]
        transition-transform
      "
      style={{ backgroundColor: bg }}
    >
      <span
        className="text-lg leading-none"
        style={{ color }}
      >
        {icon}
      </span>

      <span className="text-[11px] sm:text-xs font-medium">
        {label}
      </span>
    </button>
  )
}


function JourneyStep({ icon, title, text, bg }) {
  return (
    <div className="text-center">

      <div
        className="
          w-12 h-12
          sm:w-14 sm:h-14
          mx-auto
          rounded-full
          flex items-center justify-center
          text-xl
        "
        style={{ backgroundColor: bg }}
      >
        {icon}
      </div>

      <p className="font-medium text-sm mt-3">
        {title}
      </p>

      <p className="text-xs text-stone-500 mt-0.5">
        {text}
      </p>

    </div>
  )
}