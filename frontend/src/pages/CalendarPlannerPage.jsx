import { useState, useEffect } from "react"
import { getWeekPlan } from "../api/plannerApi"

import WeekCalendar from "../components/planner/WeekCalendar"
import PlanOutfitModal from "../components/planner/PlanOutfitModal"
import PlannedOutfitModal from "../components/planner/PlannedOutfitModal"
import PerfectForToday from "../components/planner/PerfectForToday"

import Spinner from "../components/ui/Spinner"
import Alert from "../components/ui/Alert"

import {
  getWeekDates,
  formatDate,
  isoDate,
} from "../utils/helpers"

export default function CalendarPlannerPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })

  const [selectedDate, setSelectedDate] = useState(null)

  // Which modal is open?
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const dates = getWeekDates(weekStart)

  const loadPlans = async () => {
    setLoading(true)
    setError("")

    try {
      const { data } = await getWeekPlan(isoDate(weekStart))
      setPlans(data.data)
    } catch {
      setError("Failed to load week plan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlans()
  }, [weekStart])

  const goWeek = (dir) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + dir * 7)
    setWeekStart(d)
  }

  const existingPlan = selectedDate
    ? plans.find(
        (p) => isoDate(p.date) === isoDate(selectedDate)
      )
    : null

  const handleDayClick = (date) => {
    const plan = plans.find(
      (p) => isoDate(p.date) === isoDate(date)
    )

    setSelectedDate(date)

    if (plan) {
      // Planned outfit → detail view
      setDetailModalOpen(true)
    } else {
      // Empty day → planning modal
      setPlanModalOpen(true)
    }
  }

  const closeModals = () => {
    setPlanModalOpen(false)
    setDetailModalOpen(false)
    setSelectedDate(null)
  }

  const handleEditPlan = () => {
    setDetailModalOpen(false)
    setPlanModalOpen(true)
  }

  return (
    <div className="page">

      {/* ─────────────────────────────────────────────
          PAGE HEADER
      ───────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-400 mb-2">
          Planner
        </p>

        <h1 className="font-display text-4xl sm:text-5xl">
          Weekly Planner
        </h1>

        <p className="text-stone-500 mt-2">
          Plan and track your outfits for each day.
        </p>
      </div>

      {/* ─────────────────────────────────────────────
          WEEK NAVIGATION
      ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => goWeek(-1)}
          className="btn-md btn-ghost"
        >
          ← Prev
        </button>

        <p className="text-sm font-medium text-stone-600">
          {formatDate(dates[0])} — {formatDate(dates[6])}
        </p>

        <button
          onClick={() => goWeek(1)}
          className="btn-md btn-ghost"
        >
          Next →
        </button>
      </div>

      <Alert
        message={error}
        type="error"
        onClose={() => setError("")}
      />

      {/* ─────────────────────────────────────────────
          WEEKLY PLANNER
      ───────────────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <WeekCalendar
          dates={dates}
          plans={plans}
          onSelectDay={handleDayClick}
          selectedDate={selectedDate}
        />
      )}

      <p className="text-xs text-stone-400 text-center mt-4">
        Click a day to plan or view an outfit
      </p>

      {/* ─────────────────────────────────────────────
          PERFECT FOR TODAY
      ───────────────────────────────────────────── */}
      <PerfectForToday />

      {/* ─────────────────────────────────────────────
          EMPTY DAY / EDIT MODAL
      ───────────────────────────────────────────── */}
      {planModalOpen && selectedDate && (
        <PlanOutfitModal
          date={selectedDate}
          existingPlan={existingPlan}
          onClose={closeModals}
          onSaved={loadPlans}
        />
      )}

      {/* ─────────────────────────────────────────────
          PLANNED OUTFIT DETAIL
      ───────────────────────────────────────────── */}
      {detailModalOpen && existingPlan && (
        <PlannedOutfitModal
          plan={existingPlan}
          onClose={closeModals}
          onEdit={handleEditPlan}
          onSaved={loadPlans}
        />
      )}

    </div>
  )
}