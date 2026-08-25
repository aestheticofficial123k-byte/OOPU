import { useState, useRef } from "react"
import { addClothing } from "../../api/clothingApi"
import Alert from "../ui/Alert"
import Spinner from "../ui/Spinner"

const TYPES = [
  "shirt","t-shirt","blouse","jeans","trousers","shorts","skirt","dress",
  "blazer","jacket","coat","sweater","hoodie",
  "sneakers","formal-shoes","boots","sandals",
  "belt","hat","scarf","bag","watch","other",
]

const initForm = {
  name:"", type:"shirt", category:"top", color:"",
  pattern:"plain", formalityLevel:"casual", season:"all-season",
  brand:"", notes:"",
}

export default function AddClothingForm({ onSuccess }) {
  const [form,     setForm]     = useState(initForm)
  const [image,    setImage]    = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")
  const fileRef = useRef()

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append("image", image)
      await addClothing(fd)
      setForm(initForm); setImage(null); setPreview(null)
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Alert message={error} type="error" onClose={() => setError("")} />

      {/* Image upload */}
      <div>
        <label className="field-label">Photo (optional)</label>
        <div
          onClick={() => fileRef.current.click()}
          className="relative cursor-pointer rounded-2xl border-2 border-dashed border-stone-200 hover:border-clay
                     transition-colors h-40 flex items-center justify-center overflow-hidden bg-stone-50"
        >
          {preview
            ? <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            : <div className="text-center text-stone-400">
                <div className="text-3xl mb-1">📷</div>
                <p className="text-xs">Click to upload</p>
              </div>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Name */}
      <div>
        <label className="field-label">Name / Label</label>
        <input
          className="field-input"
          placeholder="e.g. Blue Oxford Shirt"
          value={form.name}
          onChange={e => update("name", e.target.value)}
        />
      </div>

      {/* Type + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Type *</label>
          <select className="field-select" value={form.type} onChange={e => update("type", e.target.value)} required>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Category *</label>
          <select className="field-select" value={form.category} onChange={e => update("category", e.target.value)} required>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="footwear">Footwear</option>
            <option value="accessory">Accessory</option>
            <option value="full-body">Full Body</option>
          </select>
        </div>
      </div>

      {/* Color + Pattern */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Color *</label>
          <input
            className="field-input" placeholder="e.g. Navy"
            value={form.color} onChange={e => update("color", e.target.value)} required
          />
        </div>
        <div>
          <label className="field-label">Pattern</label>
          <select className="field-select" value={form.pattern} onChange={e => update("pattern", e.target.value)}>
            {["plain","striped","checked","floral","geometric","abstract","animal-print","other"]
              .map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Formality + Season */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Formality *</label>
          <select className="field-select" value={form.formalityLevel} onChange={e => update("formalityLevel", e.target.value)} required>
            <option value="casual">Casual</option>
            <option value="semi-formal">Semi-Formal</option>
            <option value="formal">Formal</option>
          </select>
        </div>
        <div>
          <label className="field-label">Season *</label>
          <select className="field-select" value={form.season} onChange={e => update("season", e.target.value)} required>
            <option value="all-season">All-Season</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="autumn">Autumn</option>
          </select>
        </div>
      </div>

      {/* Brand + Notes */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Brand</label>
          <input className="field-input" placeholder="e.g. Zara" value={form.brand} onChange={e => update("brand", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Notes</label>
          <input className="field-input" placeholder="Any notes..." value={form.notes} onChange={e => update("notes", e.target.value)} />
        </div>
      </div>

      <button type="submit" className="btn-md btn-dark w-full" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Add to Wardrobe"}
      </button>
    </form>
  )
}
