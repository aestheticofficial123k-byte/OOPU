import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth }    from "../context/AuthContext"
import { getClothes } from "../api/clothingApi"
import Spinner from "../components/ui/Spinner"

function StatCard({ label, value, emoji, to }) {
  return (
    <Link to={to} className="card-hover p-5 flex items-center gap-4">
      <div className="text-3xl">{emoji}</div>
      <div>
        <p className="text-2xl font-display font-semibold">{value}</p>
        <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats,   setStats]   = useState(null)
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
        const mostWorn = [...items].sort((a,b) => b.wearCount - a.wearCount)[0]
        setStats({
          total:     items.length,
          tops:      tops.data.count,
          bottoms:   bottoms.data.count,
          footwear:  footwear.data.count,
          wornCount: worn.length,
          mostWorn,
        })
      } catch {}
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">Good day, {user?.name?.split(" ")[0]} 👋</h1>
      <p className="page-sub">Here's your wardrobe at a glance.</p>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Items"  value={stats.total}    emoji="👔" to="/wardrobe" />
            <StatCard label="Tops"         value={stats.tops}     emoji="👕" to="/wardrobe?category=top" />
            <StatCard label="Bottoms"      value={stats.bottoms}  emoji="👖" to="/wardrobe?category=bottom" />
            <StatCard label="Footwear"     value={stats.footwear} emoji="👟" to="/wardrobe?category=footwear" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Quick actions */}
            <div className="card p-6">
              <h2 className="font-display text-xl mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { to: "/add",     label: "Add new clothing item",    emoji: "➕" },
                  { to: "/outfits", label: "Get outfit suggestions",   emoji: "✨" },
                  { to: "/planner", label: "Plan this week's outfits", emoji: "📅" },
                ].map(({ to, label, emoji }) => (
                  <Link
                    key={to} to={to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-warm transition-colors text-sm"
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="font-medium">{label}</span>
                    <span className="ml-auto text-stone-400">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Most worn */}
            <div className="card p-6">
              <h2 className="font-display text-xl mb-4">Most Worn</h2>
              {stats.mostWorn ? (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-warm overflow-hidden flex-shrink-0">
                    {stats.mostWorn.imageUrl
                      ? <img src={stats.mostWorn.imageUrl} alt="most worn" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                    }
                  </div>
                  <div>
                    <p className="font-medium capitalize">{stats.mostWorn.name || stats.mostWorn.type}</p>
                    <p className="text-sm text-stone-500">{stats.mostWorn.color} · {stats.mostWorn.pattern}</p>
                    <p className="text-xs text-clay font-medium mt-1">Worn {stats.mostWorn.wearCount}× times</p>
                  </div>
                </div>
              ) : (
                <p className="text-stone-400 text-sm">No wear history yet. Start planning outfits!</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
