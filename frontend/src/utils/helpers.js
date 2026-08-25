/**
 * utils/helpers.js
 * Shared formatting helpers used across components.
 */

export const formalityBadge = (level) => ({
  casual:      "badge-casual",
  "semi-formal":"badge-semi",
  formal:      "badge-formal",
}[level] || "badge")

export const seasonBadge = (s) => ({
  summer:     "badge-summer",
  winter:     "badge-winter",
  spring:     "badge-spring",
  autumn:     "badge-autumn",
  "all-season":"badge-allseason",
}[s] || "badge")

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

export const getWeekDates = (startDate = new Date()) => {
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d
  })
}

export const isoDate = (d) => new Date(d).toISOString().split("T")[0]

export const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ") : ""
