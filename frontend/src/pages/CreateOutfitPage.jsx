import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useClothing } from "../hooks/useClothing"
import { createOutfit } from "../api/outfitApi"

import Spinner from "../components/ui/Spinner"
import Alert from "../components/ui/Alert"

export default function CreateOutfitPage() {
  const navigate = useNavigate()
  const { items, loading, error: wardrobeError } = useClothing({})

  const [selectedItems, setSelectedItems] = useState([])
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const toggleItem = (item) => {
    setSelectedItems((current) => {
      const exists = current.some((selected) => selected._id === item._id)

      if (exists) {
        return current.filter((selected) => selected._id !== item._id)
      }

      return [...current, item]
    })
  }

  const handleCreate = async () => {
    if (selectedItems.length === 0) {
      setError("Select at least one clothing item.")
      return
    }

    setSaving(true)
    setError("")

    try {
      await createOutfit({
        title: title.trim(),
        items: selectedItems.map((item) => item._id),
        tags: tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
        isPublic,
      })

      navigate("/outfits")
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not create outfit."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF4E3] text-[#171513]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Header */}
        <div className="mb-7">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-stone-500 hover:text-[#171513] mb-4"
          >
            ← Back
          </button>

          <p className="text-xs uppercase tracking-[0.18em] text-stone-400 mb-2">
            Create your look
          </p>

          <h1 className="font-display text-4xl sm:text-5xl">
            Create Outfit
          </h1>

          <p className="text-stone-500 mt-2">
            Pick pieces from your wardrobe and build a look.
          </p>
        </div>

        <Alert
          message={error || wardrobeError}
          type="error"
          onClose={() => setError("")}
        />

        {/* Selected preview */}
        <section className="bg-white/80 border border-white rounded-[28px] p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl">
                Your Look
              </h2>

              <p className="text-xs text-stone-500 mt-1">
                {selectedItems.length} item
                {selectedItems.length !== 1 ? "s" : ""} selected
              </p>
            </div>

            {selectedItems.length > 0 && (
              <button
                onClick={() => setSelectedItems([])}
                className="text-xs text-stone-400 hover:text-[#FF8066]"
              >
                Clear
              </button>
            )}
          </div>

          {selectedItems.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {selectedItems.map((item) => (
                <button
                  key={item._id}
                  onClick={() => toggleItem(item)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name || item.type}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm">
                    ×
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-stone-200 py-12 text-center">
              <div className="text-4xl mb-3">👕</div>

              <p className="font-display text-lg">
                Start building your outfit
              </p>

              <p className="text-sm text-stone-400 mt-1">
                Select pieces from your wardrobe below.
              </p>
            </div>
          )}
        </section>

        {/* Wardrobe */}
        <section className="mb-6">
          <div className="mb-4">
            <h2 className="font-display text-2xl">
              Choose Pieces
            </h2>

            <p className="text-sm text-stone-500">
              Tap an item to add or remove it.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {items.map((item) => {
                const selected = selectedItems.some(
                  (selectedItem) => selectedItem._id === item._id
                )

                return (
                  <button
                    key={item._id}
                    onClick={() => toggleItem(item)}
                    className={`
                      relative
                      text-left
                      bg-white
                      rounded-2xl
                      overflow-hidden
                      border-2
                      transition-all
                      ${
                        selected
                          ? "border-[#20B2AA] scale-[0.98]"
                          : "border-transparent hover:border-stone-200"
                      }
                    `}
                  >
                    <div className="aspect-square bg-stone-100">
                      <img
                        src={item.imageUrl}
                        alt={item.name || item.type}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3">
                      <p className="text-sm font-medium truncate">
                        {item.name || item.type}
                      </p>

                      <p className="text-xs text-stone-400 capitalize mt-0.5">
                        {item.color}
                      </p>
                    </div>

                    {selected && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#20B2AA] text-white flex items-center justify-center font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="font-display text-xl">
                Your wardrobe is empty
              </p>

              <button
                onClick={() => navigate("/add")}
                className="mt-4 bg-[#171513] text-white rounded-full px-6 py-3 text-sm font-semibold"
              >
                Add Clothing
              </button>
            </div>
          )}
        </section>

        {/* Outfit details */}
        <section className="bg-white/80 border border-white rounded-[28px] p-5 sm:p-6 mb-6">
          <h2 className="font-display text-2xl mb-5">
            Outfit Details
          </h2>

          <div className="space-y-4">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Outfit name
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunday Casual"
                maxLength={120}
                className="
                  w-full
                  bg-white
                  border border-stone-200
                  rounded-2xl
                  px-4 py-3.5
                  text-sm
                  outline-none
                  focus:border-[#20B2AA]
                "
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Style tags
              </label>

              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="casual, streetwear, summer"
                className="
                  w-full
                  bg-white
                  border border-stone-200
                  rounded-2xl
                  px-4 py-3.5
                  text-sm
                  outline-none
                  focus:border-[#20B2AA]
                "
              />

              <p className="text-[11px] text-stone-400 mt-1.5">
                Separate tags with commas.
              </p>
            </div>

            {/* Public */}
            <label className="flex items-center justify-between gap-4 p-4 bg-[#FFF4E3] rounded-2xl cursor-pointer">
              <div>
                <p className="text-sm font-semibold">
                  Share with community
                </p>

                <p className="text-xs text-stone-500 mt-1">
                  Let other OOPU users discover this outfit.
                </p>
              </div>

              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 accent-[#20B2AA]"
              />
            </label>
          </div>
        </section>

        {/* Create */}
        <button
          onClick={handleCreate}
          disabled={saving || selectedItems.length === 0}
          className="
            w-full
            bg-[#171513]
            text-white
            rounded-full
            py-4
            font-semibold
            disabled:opacity-40
            disabled:cursor-not-allowed
            hover:scale-[1.01]
            transition-transform
          "
        >
          {saving
            ? "Creating..."
            : isPublic
              ? "Share Outfit →"
              : "Save Outfit →"}
        </button>

      </div>
    </div>
  )
}