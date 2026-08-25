export default function Spinner({ size = "md", className = "" }) {
  const s = { sm: "h-4 w-4", md: "h-7 w-7", lg: "h-10 w-10" }[size]
  return (
    <div className={`inline-block ${s} animate-spin rounded-full border-2 border-clay/30 border-t-clay ${className}`} />
  )
}
