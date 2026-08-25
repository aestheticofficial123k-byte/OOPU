import { useState }        from "react"
import { Link }             from "react-router-dom"
import { useClothing }      from "../hooks/useClothing"
import ClothingCard         from "../components/clothing/ClothingCard"
import ClothingFilters      from "../components/clothing/ClothingFilters"
import Spinner              from "../components/ui/Spinner"
import Alert                from "../components/ui/Alert"
import EmptyState           from "../components/ui/EmptyState"

export default function WardrobePage() {
  const [filters, setFilters] = useState({})
  const { items, loading, error, removeItem } = useClothing(filters)

  return (
    <div className="page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">My Wardrobe</h1>
          <p className="text-stone-500 text-sm">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/add" className="btn-md btn-dark self-start">
          + Add Item
        </Link>
      </div>

      <div className="mb-5">
        <ClothingFilters filters={filters} onChange={setFilters} />
      </div>

      <Alert message={error} type="error" />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="👚"
          title="Your wardrobe is empty"
          desc="Start adding clothing items to build your digital wardrobe."
          action={<Link to="/add" className="btn-md btn-dark">Add First Item</Link>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(item => (
            <ClothingCard key={item._id} item={item} onDelete={removeItem} />
          ))}
        </div>
      )}
    </div>
  )
}
