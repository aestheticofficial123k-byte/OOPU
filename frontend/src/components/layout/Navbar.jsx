import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const nav = [
  { to: "/",          label: "Dashboard" },
  { to: "/wardrobe",  label: "Wardrobe"  },
  { to: "/add",       label: "Add Item"  },
  { to: "/outfits",   label: "Outfits"   },
  { to: "/planner",   label: "Planner"   },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate("/login") }

  return (
    <header className="sticky top-0 z-40 bg-parch/95 backdrop-blur-sm border-b border-stone-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-semibold tracking-wide text-ink">
          Oopu
        </Link>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-1 flex-1">
          {nav.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-ink text-parch"
                      : "text-stone-600 hover:bg-stone-100"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-stone-500 font-medium">
            {user?.name}
          </span>
          <button onClick={handleLogout} className="btn-sm btn-ghost">
            Sign out
          </button>
        </div>
      </nav>
    </header>
  )
}
