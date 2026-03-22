import { FiSearch, FiX } from 'react-icons/fi'

const ROLES = ['All', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper']
const SORTS = [
  { value: 'name',      label: 'Name (A–Z)' },
  { value: 'name_desc', label: 'Name (Z–A)' },
  { value: 'age',       label: 'Age ↑' },
  { value: 'age_desc',  label: 'Age ↓' },
]

export default function FilterBar({ filters, onChange, total, showing }) {
  const set = (k, v) => onChange({ ...filters, [k]: v })
  const reset = () => onChange({ search: '', role: 'All', sort: 'name', minAge: '', maxAge: '' })
  const hasFilters = filters.search || filters.role !== 'All' || filters.minAge || filters.maxAge

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-3 border border-white/20">

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-9 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/50 text-sm"
          />
          {filters.search && (
            <button onClick={() => set('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
              <FiX size={14} />
            </button>
          )}
        </div>
        <select
          value={filters.sort}
          onChange={e => set('sort', e.target.value)}
          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/50 min-w-[140px]"
        >
          {SORTS.map(s => <option key={s.value} value={s.value} className="bg-orange-700">{s.label}</option>)}
        </select>
      </div>

      {/* Role pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-white/50 text-xs font-medium">Role:</span>
        {ROLES.map(r => (
          <button key={r} onClick={() => set('role', r)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all
              ${filters.role === r
                ? 'bg-white text-orange-600 shadow'
                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'}`}>
            {r}
          </button>
        ))}
      </div>

      {/* Age range + stats */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-white/50 text-xs font-medium">Age:</span>
        <input type="number" placeholder="Min" value={filters.minAge}
          onChange={e => set('minAge', e.target.value)}
          className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-white text-xs placeholder-white/40 focus:outline-none" />
        <span className="text-white/40 text-xs">–</span>
        <input type="number" placeholder="Max" value={filters.maxAge}
          onChange={e => set('maxAge', e.target.value)}
          className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-white text-xs placeholder-white/40 focus:outline-none" />
        {hasFilters && (
          <button onClick={reset} className="text-white/50 hover:text-white text-xs underline">Clear all</button>
        )}
        <div className="ml-auto flex gap-4 text-xs text-white/60">
          <span>Total: <span className="text-white font-semibold">{total}</span></span>
          <span>Showing: <span className="text-white font-semibold">{showing}</span></span>
        </div>
      </div>
    </div>
  )
}
