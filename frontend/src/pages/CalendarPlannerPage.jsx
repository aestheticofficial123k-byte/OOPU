import { useState, useEffect } from "react"
import { getWeekPlan }    from "../api/plannerApi"
import WeekCalendar       from "../components/planner/WeekCalendar"
import PlanOutfitModal    from "../components/planner/PlanOutfitModal"
import Spinner            from "../components/ui/Spinner"
import Alert              from "../components/ui/Alert"
import { getWeekDates, formatDate, isoDate } from "../utils/helpers"

export default function CalendarPlannerPage() {
  const [plans,    setPlans]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState("")
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(); d.setHours(0,0,0,0); return d
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen,    setModalOpen]    = useState(false)

  const dates = getWeekDates(weekStart)

  const loadPlans = async () => {
    setLoading(true); setError("")
    try {
      const { data } = await getWeekPlan(isoDate(weekStart))
      setPlans(data.data)
    } catch { setError("Failed to load week plan") }
    finally { setLoading(false) }
  }

  useEffect(() => { loadPlans() }, [weekStart])

  const goWeek = (dir) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + dir * 7)
    setWeekStart(d)
  }

  const handleDayClick = (date) => {
    setSelectedDate(date)
    setModalOpen(true)
  }

  const existingPlan = selectedDate
    ? plans.find(p => isoDate(p.date) === isoDate(selectedDate))
    : null

  return (
    <div className="page">
      <h1 className="page-title">Weekly Planner</h1>
      <p className="page-sub">Plan and track your outfits for each day.</p>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => goWeek(-1)} className="btn-md btn-ghost">← Prev</button>
        <p className="text-sm font-medium text-stone-600">
          {formatDate(dates[0])} — {formatDate(dates[6])}
        </p>
        <button onClick={() => goWeek(1)} className="btn-md btn-ghost">Next →</button>
      </div>

      <Alert message={error} type="error" onClose={() => setError("")} />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <WeekCalendar
          dates={dates}
          plans={plans}
          onSelectDay={handleDayClick}
          selectedDate={selectedDate}
        />
      )}

      <p className="text-xs text-stone-400 text-center mt-4">
        Click any day to plan or edit an outfit
      </p>

      {modalOpen && selectedDate && (
        <PlanOutfitModal
          date={selectedDate}
          existingPlan={existingPlan}
          onClose={() => { setModalOpen(false); setSelectedDate(null) }}
          onSaved={loadPlans}
        />
      )}
    </div>
  )
}
