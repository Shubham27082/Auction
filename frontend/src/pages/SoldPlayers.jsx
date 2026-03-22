import { useState } from 'react'
import { getPlayers } from '../api/players'
import useFetch from '../hooks/useFetch'
import { updatePlayerStatus } from '../services/api'
import { formatCurrency, imgUrl } from '../utils/format'
import { FiUser, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

function SoldPlayerCard({ player, onRemoved }) {
  const [confirming, setConfirming] = useState(false)
  const [loading,    setLoading]    = useState(false)

  const handleRemove = async () => {
    setLoading(true)
    try {
      await updatePlayerStatus(player.id, 'AVAILABLE')
      toast.success(`${player.playerName} removed from sold list`)
      onRemoved()
    } catch {
      toast.error('Failed to remove player')
    } finally { setLoading(false); setConfirming(false) }
  }

  return (
    <div className="card border-green-800 hover:border-green-600 transition-colors relative group">
      {/* Remove button */}
      <button
        onClick={() => setConfirming(true)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-red-900/40 hover:bg-red-500 text-red-400 hover:text-white p-1.5 rounded-full transition-all"
        title="Remove from sold"
      >
        <FiTrash2 size={13} />
      </button>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden shrink-0">
          {imgUrl(player.playerImage)
            ? <img src={imgUrl(player.playerImage)} alt={player.playerName} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-500"><FiUser size={20} /></div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{player.playerName}</p>
          <p className="text-xs text-gray-400">{player.role}</p>
        </div>
        <span className="badge-sold shrink-0">SOLD</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800 grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-xs text-gray-500">Sold To</p>
          <p className="text-green-400 font-medium">{player.soldToTeamName || '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Sold Price</p>
          <p className="text-yellow-400 font-bold">{formatCurrency(player.soldPrice)}</p>
        </div>
      </div>

      {/* Confirm overlay */}
      {confirming && (
        <div className="absolute inset-0 bg-gray-900/90 rounded-xl flex flex-col items-center justify-center gap-3 p-4">
          <p className="text-white text-sm font-semibold text-center">
            Remove "{player.playerName}" from sold list?
          </p>
          <p className="text-gray-400 text-xs text-center">Player will be reset to Available.</p>
          <div className="flex gap-2 w-full">
            <button onClick={handleRemove} disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Removing...' : 'Yes, Remove'}
            </button>
            <button onClick={() => setConfirming(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SoldPlayers() {
  const { data: players, loading, refetch } = useFetch(() => getPlayers('SOLD'))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Sold Players</h1>
        <p className="text-gray-400 text-sm">{players?.length || 0} players sold</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card animate-pulse h-24 bg-gray-800" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players?.map(p => (
            <SoldPlayerCard key={p.id} player={p} onRemoved={refetch} />
          ))}
          {players?.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-12">No sold players yet</p>
          )}
        </div>
      )}
    </div>
  )
}
