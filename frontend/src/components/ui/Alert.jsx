export default function Alert({ message, type = "error", onClose }) {
  if (!message) return null
  const styles = {
    error:   "bg-red-50 border-red-200 text-red-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    info:    "bg-blue-50 border-blue-200 text-blue-700",
  }
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${styles[type]}`}>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 font-bold">✕</button>
      )}
    </div>
  )
}
