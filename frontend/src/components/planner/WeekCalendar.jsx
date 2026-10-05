import { isoDate } from "../../utils/helpers"

function OutfitItems({ plan }) {
  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        <div className="w-10 h-10 rounded-full border border-[#F4B39D] flex items-center justify-center text-2xl text-stone-700">
          +
        </div>

        <span className="text-xs text-stone-500">
          Add Outfit
        </span>
      </div>
    )
  }

  const items = [
    plan.topId,
    plan.bottomId,
    plan.footwearId,
  ].filter(Boolean)

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-2">
        <div className="w-16 h-16 rounded-2xl bg-[#F8F4ED] flex items-center justify-center text-2xl">
          👕
        </div>

        <span className="text-xs text-stone-500">
          Outfit planned
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-1 flex-1 px-1">
      {items.slice(0, 3).map((item, index) => (
        <div
          key={item._id || index}
          className="w-[31%] aspect-square rounded-xl bg-[#FAF8F4] overflow-hidden"
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg">
              👕
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function WeekCalendar({
  dates,
  plans,
  onSelectDay,
  selectedDate,
}) {
  const getPlan = (date) =>
    plans.find(
      (plan) => isoDate(plan.date) === isoDate(date)
    )

  const today = isoDate(new Date())

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {dates.map((date) => {
        const iso = isoDate(date)
        const plan = getPlan(date)

        const isToday = iso === today
        const isSelected =
          selectedDate &&
          isoDate(selectedDate) === iso

        const weekday = date.toLocaleDateString("en-US", {
          weekday: "short",
        })

        const month = date.toLocaleDateString("en-US", {
          month: "short",
        })

        const day = date.getDate()

        return (
          <button
            key={iso}
            type="button"
            onClick={() => onSelectDay(date)}
            className={`
              group relative min-h-[230px]
              rounded-[22px]
              border
              text-left
              overflow-hidden
              transition-all duration-200
              focus:outline-none

              ${
                isToday
                  ? "bg-[#FFF1EA] border-[#F4B39D]"
                  : "bg-white border-stone-100"
              }

              ${
                isSelected
                  ? "ring-2 ring-[#D98263] ring-offset-2"
                  : "hover:-translate-y-0.5 hover:shadow-md"
              }
            `}
          >
            {/* Day */}
            <div className="px-4 pt-4 text-center">
              <p
                className={`text-sm font-semibold ${
                  isToday
                    ? "text-[#D45F3F]"
                    : "text-stone-800"
                }`}
              >
                {weekday}
              </p>

              <p className="text-xs text-stone-400 mt-0.5">
                {month} {day}
              </p>
            </div>

            {/* Outfit */}
            <div className="px-3 pt-3 pb-2 min-h-[145px] flex">
              <OutfitItems plan={plan} />
            </div>

            {/* Status */}
            {plan && (
              <div className="absolute bottom-0 left-0 right-0 bg-[#E7F6F0] py-2.5 text-center">
                <span className="text-xs font-medium text-[#4D7668]">
                  Planned
                </span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}