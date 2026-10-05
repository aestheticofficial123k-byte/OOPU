import { useState, useRef } from "react"
import { removeBackground } from "@imgly/background-removal"

import { addClothing } from "../../api/clothingApi"
import Alert from "../ui/Alert"
import Spinner from "../ui/Spinner"

const TYPES = [
  "shirt",
  "t-shirt",
  "blouse",
  "jeans",
  "trousers",
  "shorts",
  "skirt",
  "dress",
  "blazer",
  "jacket",
  "coat",
  "sweater",
  "hoodie",
  "sneakers",
  "formal-shoes",
  "boots",
  "sandals",
  "belt",
  "hat",
  "scarf",
  "bag",
  "watch",
  "other",
]

const initForm = {
  name: "",
  type: "shirt",
  category: "top",
  color: "",
  pattern: "plain",
  formalityLevel: "casual",
  season: "all-season",
  brand: "",
  notes: "",
}

const OOPU_BACKGROUND = "#FFFFFF"

export default function AddClothingForm({ onSuccess }) {
  const [form, setForm] = useState(initForm)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")

  const fileRef = useRef(null)

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const createOopuImage = (blob) => {
    return new Promise((resolve, reject) => {
      const imageElement = new Image()
      const objectUrl = URL.createObjectURL(blob)

      imageElement.onload = () => {
        try {
          const maxSize = 1000

          const scale = Math.min(
            maxSize / imageElement.width,
            maxSize / imageElement.height,
            1
          )

          const width = Math.round(
            imageElement.width * scale
          )

          const height = Math.round(
            imageElement.height * scale
          )

          const canvas = document.createElement("canvas")

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext("2d")

          if (!ctx) {
            throw new Error("Could not create canvas")
          }

          // OOPU background
          ctx.fillStyle = OOPU_BACKGROUND
          ctx.fillRect(0, 0, width, height)

          // Keep the clothing centered
          ctx.drawImage(
            imageElement,
            0,
            0,
            width,
            height
          )

          canvas.toBlob(
            (result) => {
              URL.revokeObjectURL(objectUrl)

              if (!result) {
                reject(
                  new Error(
                    "Could not create processed image"
                  )
                )
                return
              }

              resolve(result)
            },
            "image/png",
            1
          )
        } catch (err) {
          URL.revokeObjectURL(objectUrl)
          reject(err)
        }
      }

      imageElement.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(
          new Error("Could not load processed image")
        )
      }

      imageElement.src = objectUrl
    })
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    setError("")
    setProcessing(true)

    try {
      // 1. Remove original background
      const removedBackground = await removeBackground(
        file,
        {
          model: "medium",
          output: {
            format: "image/png",
            quality: 1,
          },
        }
      )

      // 2. Put the cutout onto OOPU's background
      const finalBlob = await createOopuImage(
        removedBackground
      )

      // 3. Convert final image to PNG File
      const processedFile = new File(
        [finalBlob],
        `oopu-${Date.now()}.png`,
        {
          type: "image/png",
        }
      )

      // 4. Store processed image
      setImage(processedFile)

      // 5. Preview final OOPU image
      const previewUrl = URL.createObjectURL(
        processedFile
      )

      setPreview(previewUrl)
    } catch (err) {
      console.error(
        "Image processing failed:",
        err
      )

      setImage(null)
      setPreview(null)

      setError(
        "Could not process the image. Please try another photo."
      )
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!image) {
      setError("Please upload an image first.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const fd = new FormData()

      Object.entries(form).forEach(
        ([key, value]) => {
          fd.append(key, value)
        }
      )

      // Upload final processed PNG
      fd.append("image", image)

      await addClothing(fd)

      setForm(initForm)
      setImage(null)
      setPreview(null)

      if (fileRef.current) {
        fileRef.current.value = ""
      }

      onSuccess?.()
    } catch (err) {
      console.error(
        "Failed to add clothing:",
        err
      )

      setError(
        err.response?.data?.message ||
          "Failed to add item."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Error */}
      <Alert
        message={error}
        type="error"
        onClose={() => setError("")}
      />

      {/* Image Upload */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <label className="field-label mb-0">
            Photo *
          </label>

          {preview && !processing && (
            <span className="text-xs font-medium text-emerald-600">
              ✓ Background removed
            </span>
          )}
        </div>

        <div
          onClick={() => {
            if (!processing && !loading) {
              fileRef.current?.click()
            }
          }}
          className={`
            group
            relative
            h-64
            sm:h-72
            rounded-3xl
            overflow-hidden
            border
            transition-all
            duration-300
            ${
              preview
                ? "border-stone-200 shadow-sm"
                : "border-dashed border-stone-300 hover:border-clay hover:bg-[#FFF9F0]"
            }
            ${
              !processing && !loading
                ? "cursor-pointer"
                : "cursor-default"
            }
          `}
          style={{
            backgroundColor: OOPU_BACKGROUND,
          }}
        >
          {/* Processing */}
          {processing ? (
            <div className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-[#F7F5F1]
            ">
              <div className="text-center">
                <div className="
                  w-12
                  h-12
                  mx-auto
                  rounded-full
                  bg-white
                  shadow-sm
                  flex
                  items-center
                  justify-center
                ">
                  <Spinner size="lg" />
                </div>

                <p className="
                  text-sm
                  font-medium
                  text-stone-700
                  mt-4
                ">
                  Cleaning your image
                </p>

                <p className="
                  text-xs
                  text-stone-400
                  mt-1
                ">
                  Removing the background...
                </p>
              </div>
            </div>

          ) : preview ? (

            <>
              {/* Clothing preview */}
              <div className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                p-6
                sm:p-8
              ">
                <img
                  src={preview}
                  alt="Processed clothing preview"
                  className="
                    max-h-full
                    max-w-full
                    object-contain
                    drop-shadow-[0_12px_18px_rgba(0,0,0,0.10)]
                    transition-transform
                    duration-500
                    group-hover:scale-[1.03]
                  "
                />
              </div>

              {/* Replace button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileRef.current?.click()
                }}
                className="
                  absolute
                  bottom-4
                  left-1/2
                  -translate-x-1/2
                  px-4
                  py-2
                  rounded-full
                  bg-white/95
                  backdrop-blur-sm
                  text-xs
                  font-medium
                  text-stone-700
                  shadow-md
                  border
                  border-stone-100
                  hover:bg-white
                  hover:scale-105
                  transition-all
                "
              >
                Replace photo
              </button>
            </>

          ) : (

            /* Empty state */
            <div className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            ">
              <div className="
                text-center
                px-6
              ">
                <div className="
                  w-14
                  h-14
                  mx-auto
                  rounded-2xl
                  bg-white
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  text-2xl
                  mb-4
                  group-hover:scale-105
                  transition-transform
                ">
                  ✦
                </div>

                <p className="
                  text-sm
                  font-semibold
                  text-stone-700
                ">
                  Add a clothing photo
                </p>

                <p className="
                  text-xs
                  text-stone-400
                  mt-1
                ">
                  We'll automatically remove the background
                </p>

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  mt-4
                  px-4
                  py-2
                  rounded-full
                  bg-white
                  border
                  border-stone-200
                  text-xs
                  font-medium
                  text-stone-600
                  shadow-sm
                ">
                  Click to browse
                </div>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {/* Name */}
      <div>
        <label className="field-label">
          Name / Label
        </label>

        <input
          className="field-input"
          placeholder="e.g. Blue Oxford Shirt"
          value={form.name}
          onChange={(e) =>
            update("name", e.target.value)
          }
        />
      </div>

      {/* Type + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">
            Type *
          </label>

          <select
            className="field-select"
            value={form.type}
            onChange={(e) =>
              update("type", e.target.value)
            }
            required
          >
            {TYPES.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label">
            Category *
          </label>

          <select
            className="field-select"
            value={form.category}
            onChange={(e) =>
              update(
                "category",
                e.target.value
              )
            }
            required
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="footwear">
              Footwear
            </option>
            <option value="accessory">
              Accessory
            </option>
            <option value="full-body">
              Full Body
            </option>
          </select>
        </div>
      </div>

      {/* Color + Pattern */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">
            Color *
          </label>

          <input
            className="field-input"
            placeholder="e.g. Navy"
            value={form.color}
            onChange={(e) =>
              update("color", e.target.value)
            }
            required
          />
        </div>

        <div>
          <label className="field-label">
            Pattern
          </label>

          <select
            className="field-select"
            value={form.pattern}
            onChange={(e) =>
              update("pattern", e.target.value)
            }
          >
            <option value="plain">Plain</option>
            <option value="striped">
              Striped
            </option>
            <option value="checked">
              Checked
            </option>
            <option value="floral">
              Floral
            </option>
            <option value="geometric">
              Geometric
            </option>
            <option value="abstract">
              Abstract
            </option>
            <option value="animal-print">
              Animal Print
            </option>
            <option value="other">
              Other
            </option>
          </select>
        </div>
      </div>

      {/* Formality + Season */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">
            Formality *
          </label>

          <select
            className="field-select"
            value={form.formalityLevel}
            onChange={(e) =>
              update(
                "formalityLevel",
                e.target.value
              )
            }
            required
          >
            <option value="casual">
              Casual
            </option>
            <option value="semi-formal">
              Semi-Formal
            </option>
            <option value="formal">
              Formal
            </option>
          </select>
        </div>

        <div>
          <label className="field-label">
            Season *
          </label>

          <select
            className="field-select"
            value={form.season}
            onChange={(e) =>
              update("season", e.target.value)
            }
            required
          >
            <option value="all-season">
              All-Season
            </option>
            <option value="summer">
              Summer
            </option>
            <option value="winter">
              Winter
            </option>
            <option value="spring">
              Spring
            </option>
            <option value="autumn">
              Autumn
            </option>
          </select>
        </div>
      </div>

      {/* Brand + Notes */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">
            Brand
          </label>

          <input
            className="field-input"
            placeholder="e.g. Zara"
            value={form.brand}
            onChange={(e) =>
              update("brand", e.target.value)
            }
          />
        </div>

        <div>
          <label className="field-label">
            Notes
          </label>

          <input
            className="field-input"
            placeholder="Any notes..."
            value={form.notes}
            onChange={(e) =>
              update("notes", e.target.value)
            }
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-md btn-dark w-full"
        disabled={loading || processing}
      >
        {loading ? (
          <Spinner size="sm" />
        ) : processing ? (
          "Processing image..."
        ) : (
          "Add to Wardrobe"
        )}
      </button>
    </form>
  )
}