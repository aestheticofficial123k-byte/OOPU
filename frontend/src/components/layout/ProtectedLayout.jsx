import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Navbar from "./Navbar"
import Spinner from "../ui/Spinner"

export default function ProtectedLayout() {
  const { isAuth, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parch">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuth) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-parch">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
