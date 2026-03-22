import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPlayers } from '../services/api'
import FilterBar from '../components/FilterBar'
import PlayerCard from '../components/PlayerCard'
import EditPlayerModal from '../components/EditPlayerModal'
import { FiRefreshCw, FiUsers } from 'react-icons/fi'
import toast from 'react-hot-toast'

const DEFAULT_FILTERS = { search: '', role: 'All', sort: 'name', minAge: '', maxAge: '' }

const Skeleton = () => (
  <div className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
)

export default function PlayerPage() {
  const navigate = useNavigate()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [editing, setEditing] = useState(null)

  const loadPlayers = async () => {
    setLoading(true)
    try {
      const res = await fetchPlayers()
      setPlayers(res.data.data || [])
    } catch {
      toast.error('Failed to load players')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPlayers() }, [])

  const filtered = useMemo(() => {
    let list = [...players]
    if (filters.search)
      list = list.filter(p => p.playerName?.toLowerCase().includes(filters.search.toLowerCase()))
    if (filters.role !== 'All')
      list = list.filter(p => p.role === filters.role)
    if (filters.minAge)
      list = list.filter(p => p.age >= Number(filters.minAge))
    if (filters.maxAge)
      list = list.filter(p => p.age <= Number(filters.maxAge))
    switch (filters.sort) {
      case 'name':      list.sort((a, b) => a.playerName?.localeCompare(b.playerName)); break
      case 'name_desc': list.sort((a, b) => b.playerName?.localeCompare(a.playerName)); break
      case 'age':       list.sort((a, b) => a.age - b.age); break
      case 'age_desc':  list.sort((a, b) => b.age - a.age); break
    }
    return list
  }, [players, filters])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">🏏 Players</h1>
            <p className="text-white/70 text-sm mt-1">Manage all auction players</p>
          </div>
          <button onClick={loadPlayers} disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all border border-white/20">
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <FilterBar filters={filters} onChange={setFilters} total={players.length} showing={filtered.length} />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <FiUsers size={36} className="text-white/60" />
            </div>
            <h3 className="text-xl font-bold text-white">No players found</h3>
            <p className="text-white/60 text-sm mt-2 max-w-xs">
              {players.length === 0 ? 'No players added yet.' : 'Try adjusting your filters.'}
            </p>
            {players.length > 0 && (
              <button onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-4 bg-white text-orange-600 font-semibold px-5 py-2 rounded-xl text-sm hover:bg-orange-50 transition-colors">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={p => navigate(`/players/${p.id}`)}
                onEdit={p => { setEditing(p) }}
              />
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditPlayerModal player={editing} onClose={() => setEditing(null)} onSaved={loadPlayers} />
      )}
    </div>
  )
}
