import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

import { useAuth } from "../../context/AuthContext"
import { auth } from "../../config/firebase"

import Alert from "../ui/Alert"
import Spinner from "../ui/Spinner"

const countryCodes = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
]

export default function AuthForm({ mode }) {
  const isLogin = mode === "login"

  const {
    login,
    register,
    phoneLogin,
    googleLogin,
  } = useAuth()

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    countryCode: "+91",
    otp: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [phoneMode, setPhoneMode] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const update = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }))

  // ── Email / Password ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        await login({
          email: form.email,
          password: form.password,
        })
      } else {
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match")
        }

        await register({
          name: form.name,
          email: form.email,
          password: form.password,
        })
      }

      navigate("/")
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  // ── Send temporary OTP ─────────────────────────────────────────────────────
  const handleSendOtp = (e) => {
    e.preventDefault()
    setError("")

    if (!form.phone.trim()) {
      setError("Please enter your phone number")
      return
    }

    setOtpSent(true)
  }

  // ── Verify temporary OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const fullPhone = `${form.countryCode}${form.phone}`

      await phoneLogin({
        phone: fullPhone,
        otp: form.otp,
      })

      navigate("/")
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Phone authentication failed"
      )
    } finally {
      setLoading(false)
    }
  }

  // ── Google Login ───────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const provider = new GoogleAuthProvider()

      const result = await signInWithPopup(auth, provider)

      const idToken = await result.user.getIdToken()

      await googleLogin(idToken)

      navigate("/")
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Google authentication failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF4E3] relative overflow-hidden">

      {/* Decorative beach shapes */}
      <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-[#20B2AA]/20" />
      <div className="absolute -bottom-40 -right-24 w-96 h-96 rounded-full bg-[#FF8066]/25" />
      <div className="absolute top-32 right-8 w-5 h-5 rounded-full bg-[#FFE680]" />

      <div className="relative z-10 min-h-screen w-full max-w-xl mx-auto px-6 py-8">

        {/* Back */}
        <Link
          to="/"
          className="text-3xl leading-none inline-block mb-10 hover:opacity-60 transition"
        >
          ←
        </Link>

        {/* Progress */}
        <div className="flex gap-3 mb-12">
          <div className="h-1.5 flex-1 rounded-full bg-[#20B2AA]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#FFE680]" />
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-none mb-4">
            {phoneMode
              ? "Continue with phone"
              : isLogin
                ? "Welcome back"
                : "Let’s sign you up"}
          </h1>

          <p className="text-stone-600 text-base sm:text-lg">
            {phoneMode
              ? "We'll use a quick OTP to verify your number. ☀️"
              : isLogin
                ? "Your wardrobe is waiting for you. ☀️"
                : "Create your account and start organising your wardrobe. ☀️"}
          </p>

          <div className="mt-4 w-24 h-1 rounded-full bg-[#FF8066]" />
        </div>

        {/* PHONE AUTH */}
        {phoneMode ? (

          <form
            onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
            className="space-y-4"
          >

            <Alert
              message={error}
              type="error"
              onClose={() => setError("")}
            />

            {/* Country + Phone */}
            <div className="flex gap-3">

              <select
                value={form.countryCode}
                onChange={e => update("countryCode", e.target.value)}
                disabled={otpSent}
                className="w-[145px] shrink-0 bg-white rounded-2xl px-4 py-5
                           text-base border border-stone-200 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/40
                           transition"
              >
                {countryCodes.map(country => (
                  <option
                    key={`${country.name}-${country.code}`}
                    value={country.code}
                  >
                    {country.flag} {country.name} ({country.code})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                inputMode="numeric"
                className="flex-1 min-w-0 bg-white rounded-2xl px-6 py-5
                           text-base border border-stone-200 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/40
                           transition"
                placeholder="Phone number"
                value={form.phone}
                onChange={e => update("phone", e.target.value)}
                required
                disabled={otpSent}
              />

            </div>

            {/* OTP */}
            {otpSent && (
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  className="w-full bg-white rounded-2xl px-6 py-5 text-base
                             border border-stone-200 shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-[#FF8066]/40
                             transition"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={e =>
                    update("otp", e.target.value.replace(/\D/g, ""))
                  }
                  required
                />

                <p className="text-xs text-stone-500 mt-2 ml-2">
                  Development OTP: 8934
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#171513] text-white rounded-2xl
                         py-5 text-base font-semibold mt-5
                         hover:bg-black transition-all
                         disabled:opacity-50"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  {otpSent ? "Verify OTP" : "Send OTP"}
                  <span className="ml-3 text-[#FFE680]">→</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setPhoneMode(false)
                setOtpSent(false)
                setError("")
                setForm(prev => ({
                  ...prev,
                  phone: "",
                  otp: "",
                }))
              }}
              className="w-full text-sm text-stone-500 hover:text-[#20B2AA] transition pt-2"
            >
              ← Use email instead
            </button>

          </form>

        ) : (

          /* EMAIL AUTH */
          <form onSubmit={handleSubmit} className="space-y-4">

            <Alert
              message={error}
              type="error"
              onClose={() => setError("")}
            />

            {!isLogin && (
              <input
                className="w-full bg-white rounded-2xl px-6 py-5 text-base
                           border border-stone-200 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/40
                           transition"
                placeholder="Name"
                value={form.name}
                onChange={e => update("name", e.target.value)}
                required
              />
            )}

            <input
              type="email"
              className="w-full bg-white rounded-2xl px-6 py-5 text-base
                         border border-stone-200 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/40
                         transition"
              placeholder="Email"
              value={form.email}
              onChange={e => update("email", e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full bg-white rounded-2xl px-6 py-5 text-base
                         border border-stone-200 shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-[#FF8066]/40
                         transition"
              placeholder="Password"
              value={form.password}
              onChange={e => update("password", e.target.value)}
              required
              minLength={6}
            />

            {!isLogin && (
              <input
                type="password"
                className="w-full bg-white rounded-2xl px-6 py-5 text-base
                           border border-stone-200 shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-[#FF8066]/40
                           transition"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={e =>
                  update("confirmPassword", e.target.value)
                }
                required
                minLength={6}
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#171513] text-white rounded-2xl
                         py-5 text-base font-semibold mt-5
                         hover:bg-black transition-all
                         disabled:opacity-50"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  {isLogin ? "Sign in" : "Continue"}
                  <span className="ml-3 text-[#FFE680]">→</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-stone-300" />
              <span className="text-xs text-stone-400">OR</span>
              <div className="flex-1 h-px bg-stone-300" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-[#171513] rounded-2xl
                         py-5 text-base font-semibold
                         border border-stone-200 shadow-sm
                         hover:border-[#FF8066] transition-all
                         disabled:opacity-50"
            >
              <span className="mr-3">G</span>
              Continue with Google
            </button>

            {/* Phone option */}
            <button
              type="button"
              onClick={() => {
                setPhoneMode(true)
                setError("")
              }}
              className="w-full bg-white text-[#171513] rounded-2xl
                         py-5 text-base font-semibold
                         border border-stone-200 shadow-sm
                         hover:border-[#20B2AA] transition-all"
            >
              📱 Continue with phone
            </button>

          </form>
        )}

        {/* Switch */}
        <p className="text-center text-sm sm:text-base text-stone-600 mt-8">
          {isLogin
            ? "Don't have an account? "
            : "Have an account? "}

          <Link
            to={isLogin ? "/register" : "/login"}
            className="font-semibold text-[#20B2AA] hover:text-[#FF8066] transition"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>

      </div>
    </div>
  )
}