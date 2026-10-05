import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const nav = [
  { to: "/", label: "Dashboard", icon: "⌂" },
  { to: "/wardrobe", label: "Wardrobe", icon: "♧" },
  { to: "/add", label: "Add Item", icon: "+" },
  { to: "/outfits", label: "Outfits", icon: "✦" },
  { to: "/planner", label: "Planner", icon: "▦" },
]

export default function Navbar() {
  const { user } = useAuth()

  const displayName = user?.name || "OOPU"

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const avatarColor = user?.avatarColor || "#CDEDEA"

  return (
    <>
      {/* =========================================================
          DESKTOP NAVBAR
          ========================================================= */}
      <header className="hidden md:block sticky top-0 z-40 bg-parch/95 backdrop-blur-sm border-b border-stone-200">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl font-semibold tracking-wide text-ink"
          >
            Oopu
          </Link>

          {/* Nav links */}
          <ul className="flex items-center gap-1 flex-1">
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

            {/* Profile avatar */}
            <Link
              to="/profile"
              title="Profile"
              className="
                w-9 h-9
                rounded-full
                border-2 border-[#20B2AA]
                flex items-center justify-center
                font-display text-sm
                hover:scale-105
                transition-transform
                shrink-0
              "
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </Link>

            {/* Username */}
            <Link
              to="/profile"
              className="
                hidden lg:block
                text-xs
                text-stone-500
                font-medium
                hover:text-[#171513]
                transition-colors
              "
            >
              {user?.username ? `@${user.username}` : user?.name}
            </Link>

          </div>

        </nav>
      </header>


      {/* =========================================================
          MOBILE TOP BAR
          ========================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-parch/95 backdrop-blur-sm border-b border-stone-200">
        <div className="h-14 px-4 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl font-semibold tracking-wide text-ink"
          >
            Oopu
          </Link>

          {/* Profile avatar */}
          <Link
            to="/profile"
            title="Profile"
            className="
              w-9 h-9
              rounded-full
              border-2 border-[#20B2AA]
              flex items-center justify-center
              font-display text-sm
              hover:scale-105
              transition-transform
              shrink-0
            "
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </Link>

        </div>
      </header>


      {/* =========================================================
          MOBILE BOTTOM NAVIGATION
          ========================================================= */}
      <nav
        className="
          md:hidden
          fixed
          bottom-0
          left-0
          right-0
          z-50
          bg-parch/95
          backdrop-blur-md
          border-t
          border-stone-200
          pb-[env(safe-area-inset-bottom)]
        "
      >
        <ul className="h-[68px] px-2 flex items-center justify-around">

          {nav.map(({ to, label, icon }) => {
            const isAdd = to === "/add"

            return (
              <li
                key={to}
                className="flex-1 flex justify-center"
              >
                <NavLink
                  to={to}
                  end={to === "/"}
                  aria-label={label}
                  className={({ isActive }) =>
                    `
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-1
                      min-w-[56px]
                      h-14
                      rounded-2xl
                      transition-all
                      ${
                        isActive
                          ? "text-ink"
                          : "text-stone-400"
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isAdd ? (
                        /* Circled Add Button */
                        <span
                          className={`
                            w-11
                            h-11
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-2xl
                            leading-none
                            font-light
                            transition-all
                            ${
                              isActive
                                ? "bg-ink text-parch scale-105"
                                : "bg-[#20B2AA] text-white"
                            }
                          `}
                        >
                          +
                        </span>
                      ) : (
                        <span
                          className={`
                            text-xl
                            leading-none
                            transition-transform
                            ${
                              isActive
                                ? "scale-110"
                                : ""
                            }
                          `}
                        >
                          {icon}
                        </span>
                      )}

                      {!isAdd && (
                        <span
                          className={`
                            text-[10px]
                            font-medium
                            leading-none
                            ${
                              isActive
                                ? "text-ink"
                                : "text-stone-400"
                            }
                          `}
                        >
                          {label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}

        </ul>
      </nav>
    </>
  )
}