import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Alert   from "../ui/Alert"
import Spinner from "../ui/Spinner"

export default function AuthForm({ mode }) {
  const isLogin = mode === "login"
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [form,    setForm]    = useState({ name:"", email:"", password:"" })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      if (isLogin) await login({ email: form.email, password: form.password })
      else         await register(form)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-parch flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl font-semibold mb-2">Oopu</h1>
          <p className="text-stone-500 text-sm">Your personal style, organised.</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h2 className="font-display text-2xl font-semibold mb-6">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>

          <Alert message={error} type="error" onClose={() => setError("")} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {!isLogin && (
              <div>
                <label className="field-label">Name</label>
                <input
                  className="field-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                className="field-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => update("email", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                className="field-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => update("password", e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-lg btn-dark w-full mt-2" disabled={loading}>
              {loading ? <Spinner size="sm" /> : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              to={isLogin ? "/register" : "/login"}
              className="text-ink font-medium hover:text-rust transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
