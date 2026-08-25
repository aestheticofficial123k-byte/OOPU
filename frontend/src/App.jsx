/**
 * App.jsx
 * Root component. Wraps entire app in AuthProvider and defines all routes.
 *
 * Route structure:
 *   /login     → LoginPage    (public)
 *   /register  → RegisterPage (public)
 *   /*         → ProtectedLayout → [nested pages] (requires auth)
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedLayout  from "./components/layout/ProtectedLayout"

import LoginPage           from "./pages/LoginPage"
import RegisterPage        from "./pages/RegisterPage"
import DashboardPage       from "./pages/DashboardPage"
import WardrobePage        from "./pages/WardrobePage"
import AddClothingPage     from "./pages/AddClothingPage"
import OutfitSuggestionsPage from "./pages/OutfitSuggestionsPage"
import CalendarPlannerPage from "./pages/CalendarPlannerPage"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — all wrapped in ProtectedLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/"         element={<DashboardPage />} />
            <Route path="/wardrobe" element={<WardrobePage />} />
            <Route path="/add"      element={<AddClothingPage />} />
            <Route path="/outfits"  element={<OutfitSuggestionsPage />} />
            <Route path="/planner"  element={<CalendarPlannerPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
