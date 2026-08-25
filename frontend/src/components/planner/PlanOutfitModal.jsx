import { useState, useEffect } from "react"
import { getClothes }        from "../../api/clothingApi"
import { createPlan, markWorn, deletePlan } from "../../api/plannerApi"
import Modal    from "../ui/Modal"
import Spinner  from "../ui/Spinner"
import Alert    from "../ui/Alert"
import { formatDate, isoDate } from "../../utils/helpers"

export default function PlanOutfitModal({ date, existingPlan, onClose, onSaved }) {
  const [clothes,   setClothes]   = useState({ tops: [], bottoms: [], footwear: [], accessories: [] })
  const [form,      setForm]      = useState({ topId:"", bottomId:"", footwearId:"", occasion:"", notes:"" })
  const [loading,   setLoading]   = useState(false)
  const [fetching,  setFetching]  = useState(true)
  const [error,     setError]     = useState("")

  // Load existing plan into form
  useEffect(() => {
    if (existingPlan) {
      setForm({
        topId:      existingPlan.topId?._id      || "",
        bottomId:   existingPlan.bottomId?._id   || "",
        footwearId: existingPlan.footwearId?._id || "",
        occasion:   existingPlan.occasion        || "",
        notes:      existingPlan.notes           || "",
      })
    }
  }, [existingPlan])

  // Fetch user's clothing items
  useEffect(() => {
    const fetch = async () => {
      setFetching(true)
      try {
        const [tops, bottoms, footwear, acc] = await Promise.all([
          getClothes({ category: "top" }),
          getClothes({ category: "bottom" }),
          getClothes({ category: "footwear" }),
          getClothes({ category: "accessory" }),
        ])
        setClothes({
          tops:        tops.data.data,
          bottoms:     bottoms.data.data,
          footwear:    footwear.data.data,
          accessories: acc.data.data,
        })
      } catch { setError("Failed to load clothing items") }
      finally { setFetching(false) }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setLoading(true); setError("")
    try {
      await createPlan({ ...form, date: isoDate(date) })
      onSaved()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save plan")
    } finally { setLoading(false) }
  }

  const handleMarkWorn = async () => {
    if (!existingPlan) return
    setLoading(true)
    try {
      await markWorn(existingPlan._id)
      onSaved(); onClose()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark as worn")
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (!existingPlan) return
    setLoading(true)
    try {
      await deletePlan(existingPlan._id)
      onSaved(); onClose()
    } catch { setError("Failed to delete plan") }
    finally { setLoading(false) }
  }

  const ClothingSelect = ({ label, field, items }) => (
    <div>
      <label className="field-label">{label}</label>
      <select
        className="field-select"
        value={form[field]}
        onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
      >
        <option value="">— None —</option>
        {items.map(i => (
          <option key={i._id} value={i._id}>
            {i.name || i.type} · {i.color}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <Modal open onClose={onClose} title={`Plan for ${formatDate(date)}`}>
      <Alert message={error} type="error" onClose={() => setError("")} />

      {fetching ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : (
        <div className="space-y-4">
          <ClothingSelect label="Top"      field="topId"      items={clothes.tops}     />
          <ClothingSelect label="Bottom"   field="bottomId"   items={clothes.bottoms}  />
          <ClothingSelect label="Footwear" field="footwearId" items={clothes.footwear} />

          <div>
            <label className="field-label">Occasion</label>
            <input
              className="field-input"
              placeholder="e.g. Office, Date night..."
              value={form.occasion}
              onChange={e => setForm(p => ({ ...p, occasion: e.target.value }))}
            />
          </div>
          <div>
            <label className="field-label">Notes</label>
            <input
              className="field-input"
              placeholder="Any notes..."
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={loading} className="btn-md btn-dark flex-1">
              {loading ? <Spinner size="sm" /> : "Save Plan"}
            </button>
            {existingPlan && !existingPlan.worn && (
              <button onClick={handleMarkWorn} disabled={loading} className="btn-md btn-light">
                Mark Worn ✓
              </button>
            )}
            {existingPlan && (
              <button onClick={handleDelete} disabled={loading} className="btn-md text-red-500 border border-red-200 hover:bg-red-50 rounded-full px-4 text-sm font-medium transition">
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
