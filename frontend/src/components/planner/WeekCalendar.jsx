import { formatDate, isoDate } from "../../utils/helpers"

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect fill='%23e8e0d0' width='60' height='60'/%3E%3Ctext fill='%23c4a882' font-size='24' x='50%25' y='55%25' text-anchor='middle' dominant-baseline='middle'%3E👕%3C/text%3E%3C/svg%3E"

function OutfitMini({ plan }) {
  if (!plan) return <p className="text-xs text-stone-400 italic">No outfit planned</p>
  const top = plan.topId || plan.bottomId || plan.footwearId
  return (
    <div className="flex items-center gap-2">
      {top?.imageUrl
        ? <img src={top.imageUrl} alt="outfit" className="w-10 h-10 rounded-lg object-cover" />
        : <div className="w-10 h-10 rounded-lg bg-warm flex items-center justify-center text-sm">👕</div>
      }
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{plan.occasion || "Outfit planned"}</p>
        {plan.worn && <span className="badge-allseason badge text-xs">Worn ✓</span>}
      </div>
    </div>
  )
}

export default function WeekCalendar({ dates, plans, onSelectDay, selectedDate }) {
  const getPlan = (date) => plans.find(p => isoDate(p.date) === isoDate(date))
  const today = isoDate(new Date())

  return (
    <div className="grid grid-cols-7 gap-2">
      {dates.map((date) => {
        const plan   = getPlan(date)
        const iso    = isoDate(date)
        const isToday   = iso === today
        const isSelected = selectedDate && isoDate(selectedDate) === iso

        return (
          <div
            key={iso}
            onClick={() => onSelectDay(date)}
            className={`card cursor-pointer transition-all duration-150 p-3 min-h-[120px] flex flex-col gap-2 ${
              isSelected ? "ring-2 ring-clay" : "hover:shadow-md hover:-translate-y-0.5"
            } ${isToday ? "border-clay/50" : ""}`}
          >
            <div className={`text-xs font-medium ${isToday ? "text-rust" : "text-stone-500"}`}>
              {formatDate(date)}
            </div>
            <div className="flex-1">
              <OutfitMini plan={plan} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
