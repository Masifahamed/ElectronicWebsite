export default function ProductFilter({ filters, setFilters, categories, onClear }) {
  const handle = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <label className="block text-sm">Price Range</label>
        <div className="flex gap-2 mt-2">
          <input type="number" placeholder="Min" value={filters.minPrice || ""} onChange={(e)=>handle("minPrice", e.target.value)} className="w-full border rounded px-3 py-2" />
          <input type="number" placeholder="Max" value={filters.maxPrice || ""} onChange={(e)=>handle("maxPrice", e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm">Minimum Rating</label>
        <select value={filters.minRating||""} onChange={(e)=>handle("minRating", e.target.value)} className="w-full border rounded px-3 py-2 mt-2">
          <option value="">Any Rating</option>
          <option value="4.5">4.5+</option>
          <option value="4">4+</option>
          <option value="3.5">3.5+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm">Minimum Discount</label>
        <select value={filters.minDiscount||""} onChange={(e)=>handle("minDiscount", e.target.value)} className="w-full border rounded px-3 py-2 mt-2">
          <option value="">Any Discount</option>
          <option value="10">10%+</option>
          <option value="20">20%+</option>
          <option value="30">30%+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm">Category</label>
        <select value={filters.category||""} onChange={(e)=>handle("category", e.target.value)} className="w-full border rounded px-3 py-2 mt-2">
          <option value="">All</option>
          {categories.map((c)=> <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="mt-3">
          <button onClick={onClear} className="text-red-600">Clear All</button>
        </div>
      </div>
    </div>
  );
}
