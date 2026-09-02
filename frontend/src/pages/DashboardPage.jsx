import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getClothes } from "../api/clothingApi"
import Spinner from "../components/ui/Spinner"

function StatCard({ label, value, emoji, to, color }) {
  return (
    <Link
      to={to}
      className={`group rounded-3xl p-5 border border-black/5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all ${color}`}
    >
      <div className="flex items-start justify-between">
        <div className="text-3xl">{emoji}</div>
        <span className="text-black/30 group-hover:text-black/60 transition">
          →
        </span>
      </div>

      <div className="mt-6">
        <p className="text-3xl font-display font-semibold text-[#202020]">
          {value}
        </p>
        <p className="text-xs text-[#5F5A54] uppercase tracking-widest mt-1">
          {label}
        </p>
      </div>
    </Link>
  )
}

function ActionCard({ to, emoji, title, description, color }) {
  return (
    <Link
      to={to}
      className={`group rounded-3xl p-5 ${color} hover:-translate-y-1 transition-all`}
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-2xl">
          {emoji}
        </div>

        <span className="text-xl text-black/40 group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>

      <h3 className="font-semibold text-[#202020] mt-5">
        {title}
      </h3>

      <p className="text-sm text-black/55 mt-1">
        {description}
      </p>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [all, tops, bottoms, footwear] = await Promise.all([
          getClothes({}),
          getClothes({ category: "top" }),
          getClothes({ category: "bottom" }),
          getClothes({ category: "footwear" }),
        ])

        const items = all.data.data
        const worn = items.filter(i => i.wearCount > 0)
        const mostWorn = [...items].sort(
          (a, b) => b.wearCount - a.wearCount
        )[0]

        setStats({
          total: items.length,
          tops: tops.data.count,
          bottoms: bottoms.data.count,
          footwear: footwear.data.count,
          wornCount: worn.length,
          mostWorn,
        })
      } catch {}

      finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  return (
    <div className="min-h-full bg-[#FFF9F1] px-4 sm:px-6 lg:px-8 py-8">

      {/* Greeting */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

          <div>
            <p className="text-sm font-medium text-[#18A999] mb-2">
              YOUR WARDROBE
            </p>

            <h1 className="text-4xl sm:text-5xl font-display font-semibold text-[#202020]">
              Hey, {user?.name?.split(" ")[0]}! 👋
            </h1>

            <p className="text-[#6B655F] mt-2">
              Everything you wear, organised beautifully.
            </p>
          </div>

          <Link
            to="/add"
            className="self-start sm:self-auto bg-[#202020] text-white px-5 py-3 rounded-full font-medium hover:scale-[1.02] transition"
          >
            + Add clothing
          </Link>

        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <StatCard
              label="Total Items"
              value={stats.total}
              emoji="👕"
              to="/wardrobe"
              color="bg-[#D9F3EE]"
            />

            <StatCard
              label="Tops"
              value={stats.tops}
              emoji="👚"
              to="/wardrobe?category=top"
              color="bg-[#FFE0D5]"
            />

            <StatCard
              label="Bottoms"
              value={stats.bottoms}
              emoji="👖"
              to="/wardrobe?category=bottom"
              color="bg-[#DDF0FF]"
            />

            <StatCard
              label="Footwear"
              value={stats.footwear}
              emoji="👟"
              to="/wardrobe?category=footwear"
              color="bg-[#E9DEFF]"
            />

          </div>

          {/* Main feature area */}
          <div className="grid lg:grid-cols-5 gap-6">

            {/* Quick Actions */}
            <div className="lg:col-span-3 bg-white rounded-[2rem] p-6 sm:p-7 border border-black/5 shadow-sm">

              <div className="mb-6">
                <p className="text-sm text-[#FF6B4A] font-semibold uppercase tracking-widest">
                  Explore
                </p>

                <h2 className="font-display text-2xl text-[#202020] mt-1">
                  What are we doing today?
                </h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">

                <ActionCard
                  to="/add"
                  emoji="📸"
                  title="Add Item"
                  description="Grow your wardrobe"
                  color="bg-[#FFE0D5]"
                />

                <ActionCard
                  to="/outfits"
                  emoji="✨"
                  title="Get Styled"
                  description="Discover outfits"
                  color="bg-[#E9DEFF]"
                />

                <ActionCard
                  to="/planner"
                  emoji="📅"
                  title="Plan"
                  description="Organise your week"
                  color="bg-[#FFF0B8]"
                />

              </div>
            </div>

            {/* Most Worn */}
            <div className="lg:col-span-2 bg-[#18A999] rounded-[2rem] p-6 sm:p-7 text-white overflow-hidden relative">

              <div className="relative z-10">
                <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
                  Your favourite
                </p>

                <h2 className="font-display text-2xl mt-1">
                  Most Worn
                </h2>

                {stats.mostWorn ? (
                  <div className="mt-6">

                    <div className="w-full h-44 rounded-3xl bg-white/20 overflow-hidden">
                      {stats.mostWorn.imageUrl ? (
                        <img
                          src={stats.mostWorn.imageUrl}
                          alt="Most worn"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          👕
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="font-semibold text-lg capitalize">
                        {stats.mostWorn.name || stats.mostWorn.type}
                      </p>

                      <p className="text-sm text-white/70 capitalize">
                        {stats.mostWorn.color} · {stats.mostWorn.pattern}
                      </p>

                      <p className="text-sm font-medium mt-2">
                        Worn {stats.mostWorn.wearCount}×
                      </p>
                    </div>

                  </div>
                ) : (
                  <p className="text-white/70 text-sm mt-8">
                    No wear history yet. Start planning outfits!
                  </p>
                )}
              </div>

              {/* Decorative circle */}
              <div className="absolute -right-16 -bottom-20 w-48 h-48 rounded-full bg-[#FFF0B8]/30" />

            </div>

          </div>

          {/* Wardrobe summary */}
          <div className="bg-[#FFF0B8] rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#202020]/50">
                Style check
              </p>

              <h2 className="font-display text-2xl sm:text-3xl text-[#202020] mt-1">
                {stats.wornCount > 0
                  ? `${stats.wornCount} pieces have been worn.`
                  : "Your wardrobe is waiting."}
              </h2>

              <p className="text-sm text-[#202020]/60 mt-2">
                Keep wearing, planning and discovering new combinations.
              </p>
            </div>

            <Link
              to="/wardrobe"
              className="bg-[#202020] text-white px-6 py-3 rounded-full font-medium self-start sm:self-auto"
            >
              View wardrobe →
            </Link>

          </div>

        </div>
      )}
    </div>
  )
}