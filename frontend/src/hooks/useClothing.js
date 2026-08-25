/**
 * hooks/useClothing.js
 * Manages fetching + caching user's clothing items.
 */
import { useState, useEffect, useCallback } from "react"
import { getClothes, deleteClothing } from "../api/clothingApi"

export const useClothing = (filters = {}) => {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getClothes(filters)
      setItems(data.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load wardrobe")
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  useEffect(() => { fetchItems() }, [fetchItems])

  const removeItem = async (id) => {
    await deleteClothing(id)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  return { items, loading, error, refetch: fetchItems, removeItem }
}
