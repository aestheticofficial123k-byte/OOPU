import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AVATAR_COLORS = [
  "#CDEDEA",
  "#FFE8E2",
  "#EEE7FF",
  "#FFF1C9",
  "#E8E3DC",
  "#DCE8FF",
]

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || "")
  const [username, setUsername] = useState(user?.username || "")
  const [avatarColor, setAvatarColor] = useState(
    user?.avatarColor || "#CDEDEA"
  )

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const initials = (name || "OOPU")
    .split(" ")
    .filter(Boolean)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleSave = async (e) => {
    e.preventDefault()

    setSaving(true)
    setMessage("")
    setError("")

    try {
      await updateProfile({
        name,
        username,
        avatarColor,
      })

      setMessage("Profile updated successfully.")
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update profile. Please try again."
      )
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#FFF4E3] text-[#171513]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400 mb-2">
            Your account
          </p>

          <h1 className="font-display text-4xl sm:text-5xl">
            Profile
          </h1>

          <p className="text-stone-500 mt-2">
            Make your OOPU profile yours.
          </p>
        </div>


        {/* Profile card */}
        <section className="
          bg-white/85
          rounded-[28px]
          border border-white
          p-6 sm:p-8
          shadow-[0_10px_40px_rgba(23,21,19,0.04)]
        ">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">

            <div
              className="
                w-24 h-24
                rounded-full
                border-[5px] border-[#20B2AA]
                flex items-center justify-center
                font-display text-4xl
                transition-colors
              "
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>

            {/* Avatar color selector */}
            <div className="mt-4">
              <p className="text-xs text-stone-400 text-center mb-2">
                Avatar color
              </p>

              <div className="flex items-center justify-center gap-2">
                {AVATAR_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAvatarColor(color)}
                    aria-label={`Select avatar color ${color}`}
                    className={`
                      w-8 h-8
                      rounded-full
                      border-2
                      transition-all
                      ${
                        avatarColor === color
                          ? "border-[#171513] scale-110"
                          : "border-white hover:scale-105"
                      }
                    `}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>


          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="
                  w-full
                  bg-[#FFF9F1]
                  border border-stone-200
                  rounded-2xl
                  px-4 py-4
                  outline-none
                  focus:border-[#20B2AA]
                  transition-colors
                "
              />
            </div>


            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Username
              </label>

              <div className="relative">
                <span className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-stone-400
                ">
                  @
                </span>

                <input
                  type="text"
                  value={username}
                  onChange={e =>
                    setUsername(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_]/g, "")
                    )
                  }
                  placeholder="your_username"
                  maxLength={20}
                  className="
                    w-full
                    bg-[#FFF9F1]
                    border border-stone-200
                    rounded-2xl
                    pl-9 pr-4
                    py-4
                    outline-none
                    focus:border-[#20B2AA]
                    transition-colors
                  "
                />
              </div>

              <p className="text-xs text-stone-400 mt-2">
                3–20 characters · letters, numbers and underscores
              </p>
            </div>


            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="
                  w-full
                  bg-stone-100
                  border border-stone-200
                  rounded-2xl
                  px-4 py-4
                  text-stone-400
                  cursor-not-allowed
                "
              />

              <p className="text-xs text-stone-400 mt-2">
                Email changes will be handled separately.
              </p>
            </div>


            {/* Status */}
            {error && (
              <div className="
                rounded-xl
                bg-[#FFE8E2]
                text-[#9F3D2E]
                px-4 py-3
                text-sm
              ">
                {error}
              </div>
            )}

            {message && (
              <div className="
                rounded-xl
                bg-[#CDEDEA]
                text-[#176F6B]
                px-4 py-3
                text-sm
              ">
                {message}
              </div>
            )}


            {/* Save */}
            <button
              type="submit"
              disabled={saving}
              className="
                w-full
                bg-[#171513]
                text-white
                rounded-2xl
                py-4
                font-semibold
                hover:scale-[1.01]
                transition-transform
                disabled:opacity-50
                disabled:hover:scale-100
              "
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </form>
        </section>


        {/* Account information */}
        <section className="
          bg-white/70
          rounded-[28px]
          border border-white
          p-6
          mt-5
        ">
          <p className="
            text-xs
            uppercase
            tracking-[0.18em]
            text-stone-400
            mb-4
          ">
            Account
          </p>

          <div className="space-y-4">

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-stone-500">
                Account ID
              </span>

              <span className="text-xs text-stone-400 truncate max-w-[180px]">
                {user?.id || "—"}
              </span>
            </div>

            <div className="h-px bg-stone-100" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-stone-500">
                Member since
              </span>

              <span className="text-sm">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Sign out */}
            <button
              type="button"
              onClick={handleLogout}
              className="
              w-full
              text-left
              text-sm
              font-bold
              text-[#FF8066]
              hover:text-[#E85F47]
              transition-colors
              py-1
              "
            >
              Sign out
            </button>

          </div>
        </section>

      </div>
    </div>
  )
}