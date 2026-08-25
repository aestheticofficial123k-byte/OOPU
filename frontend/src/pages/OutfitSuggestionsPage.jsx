import { useState } from "react"
import { getSuggestions, getOccasionSuggestions } from "../api/outfitApi"
import OutfitCard from "../components/outfit/OutfitCard"
import Spinner    from "../components/ui/Spinner"
import Alert      from "../components/ui/Alert"
import EmptyState from "../components/ui/EmptyState"
import { Link }   from "react-router-dom"

const OCCASIONS = ["casual", "semi-formal", "formal"]

export default function OutfitSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState("")
  const [activeOcc,   setActiveOcc]   = useState("general")

  const fetchSuggestions = async (occasion) => {
    setLoading(true); setError(""); setActiveOcc(occasion)
    try {
      const { data } = occasion === "general"
        ? await getSuggestions()
        : await getOccasionSuggestions(occasion)
      setSuggestions(data.data)
    } catch (err) {
      setError(err.response?.data?.message || "Could not load suggestions")
      setSuggestions([])
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <h1 className="page-title">Outfit Suggestions</h1>
      <p className="page-sub">Rule-based combinations from your wardrobe.</p>

      {/* Occasion selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["general", ...OCCASIONS].map(occ => (
          <button
            key={occ}
            onClick={() => fetchSuggestions(occ)}
            className={`btn-md capitalize ${
              activeOcc === occ && suggestions.length > 0
                ? "btn-dark"
                : "btn-ghost"
            }`}
          >
            {occ === "general" ? "✨ General" : occ}
          </button>
        ))}
      </div>

      <Alert message={error} type="error" onClose={() => setError("")} />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : suggestions.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((s, i) => <OutfitCard key={i} outfit={s} rank={i} />)}
        </div>
      ) : !loading && !error ? (
        <EmptyState
          icon="✨"
          title="Pick an occasion above"
          desc="Click General or a specific formality level to see outfit suggestions."
        />
      ) : null}

      {error && (
        <div className="mt-4 text-center">
          <Link to="/add" className="btn-md btn-light">Add more clothes →</Link>
        </div>
      )}
    </div>
  )
}
