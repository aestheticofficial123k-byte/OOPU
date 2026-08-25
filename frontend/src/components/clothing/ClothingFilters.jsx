export default function ClothingFilters({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val })
  const clear = () => onChange({})

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filters.category || ""}
        onChange={e => set("category", e.target.value)}
        className="field-select !w-auto !py-1.5 text-xs"
      >
        <option value="">All Categories</option>
        <option value="top">Tops</option>
        <option value="bottom">Bottoms</option>
        <option value="footwear">Footwear</option>
        <option value="accessory">Accessories</option>
        <option value="full-body">Full Body</option>
      </select>

      <select
        value={filters.season || ""}
        onChange={e => set("season", e.target.value)}
        className="field-select !w-auto !py-1.5 text-xs"
      >
        <option value="">All Seasons</option>
        <option value="summer">Summer</option>
        <option value="winter">Winter</option>
        <option value="spring">Spring</option>
        <option value="autumn">Autumn</option>
        <option value="all-season">All-Season</option>
      </select>

      <select
        value={filters.formalityLevel || ""}
        onChange={e => set("formalityLevel", e.target.value)}
        className="field-select !w-auto !py-1.5 text-xs"
      >
        <option value="">All Formality</option>
        <option value="casual">Casual</option>
        <option value="semi-formal">Semi-Formal</option>
        <option value="formal">Formal</option>
      </select>

      {hasFilters && (
        <button onClick={clear} className="text-xs text-stone-400 hover:text-rust transition-colors">
          Clear filters
        </button>
      )}
    </div>
  )
}
