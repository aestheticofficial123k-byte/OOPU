/**
 * App.jsx
 * Root component. Wraps entire app in AuthProvider and defines all routes.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedLayout from "./components/layout/ProtectedLayout"

import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import WardrobePage from "./pages/WardrobePage"
import AddClothingPage from "./pages/AddClothingPage"
import OutfitSuggestionsPage from "./pages/OutfitSuggestionsPage"
import CreateOutfitPage from "./pages/CreateOutfitPage"
import CalendarPlannerPage from "./pages/CalendarPlannerPage"
import ProfilePage from "./pages/ProfilePage"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />


          {/* Protected routes */}
          <Route element={<ProtectedLayout />}>

            <Route
              path="/"
              element={<DashboardPage />}
            />

            <Route
              path="/wardrobe"
              element={<WardrobePage />}
            />

            <Route
              path="/add"
              element={<AddClothingPage />}
            />

            {/* Outfit hub */}
            <Route
              path="/outfits"
              element={<OutfitSuggestionsPage />}
            />

            {/* Create outfit */}
            <Route
              path="/add-outfit"
              element={<CreateOutfitPage />}
            />

            <Route
              path="/planner"
              element={<CalendarPlannerPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

          </Route>


          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}