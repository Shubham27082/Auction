import { useState, useEffect } from 'react'
import { FiX, FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { resolveImage } from '../utils/format'
import { deletePlayer, updatePlayerStatus } from '../services/api'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  SOLD:      'bg-blue-100 text-blue-700',
  UNSOLD:    'bg-red-100 text-red-700',
}

export default function PlayerModal({ player, onClose, onEdit, onDeleted, onStatusChanged }) {
  const [confirming, setConfirming] = useState(false)
  const [loading,    setLoading]    = useState(false)

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  if (!player) return null
  const image = resolveImage(player.playerImage)

  const details = [
    { label: 'Age',         value: player.age },
    { label: 'Village',     value: player.village || player.nativePlace },
    { label: 'Contact',     value: player.contactNo || player.phoneNumber },
    { label: 'Batting',     value: player.battingStyle },
    { label: 'Bowling',     value: player.bowlingStyle },
    { label: 'Jersey Name', value: player.jerseyName },
    { label: 'Jersey No.',  value: player.jerseyNumber ? `#${player.jerseyNumber}` : null },
    { label: 'Jersey Size', value: player.jerseySize },
  ].filter(d => d.value)

  const handleDelete = async () => {
    setLoading(true)
    try {
      if (player.status === 'SOLD' || player.status === 'UNSOLD') {
        // Reset to AVAILABLE — removes from sold/unsold list, keeps in players
        await updatePlayerStatus(player.id, 'AVAILABLE')
        toast.success(`${player.playerName} reset to Available`)
      } else {
        await deletePlayer(player.id)
        toast.success(`${player.playerName} deleted`)
      }
      onDeleted?.()
      onClose()
    } catch {
      toast.error('Action failed')
    } finally { setLoading(false); setConfirming(false) }
  }

  const handleStatus = async (status) => {
    setLoading(true)
    try {
      await updatePlayerStatus(player.id, status)
      toast.success(`Marked as ${status}`)
      onStatusChanged?.()
      onClose()
    } catch {
      toast.error('Failed to update status')
    } finally { setLoading(false) }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-500 to-amber-400 pt-8 pb-10 px-4 text-center">
          <button onClick={onClose}
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white p-1.5 rounded-full transition-colors">
            <FiX size={15} />
          </button>
          <button onClick={() => { onClose(); onEdit(player) }}
            className="absolute top-3 left-3 bg-white/20 hover:bg-white/40 text-white p-1.5 rounded-full transition-colors">
            <FiEdit2 size={15} />
          </button>

          <div className="w-20 h-20 mx-auto border-4 border-white shadow-lg overflow-hidden bg-orange-200">
            {image ? (
              <img src={image} alt={player.playerName} className="w-full h-full object-cover"
                onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
            ) : null}
            <div className={`w-full h-full items-center justify-center bg-orange-200 ${image ? 'hidden' : 'flex'}`}>
              <FiUser size={30} className="text-orange-400" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-white mt-2 leading-tight">{player.playerName}</h2>
          {player.jerseyName && <p className="text-white/70 text-xs">"{player.jerseyName}"</p>}
          <p className="text-white/80 text-xs mt-0.5">{player.role}</p>
          {player.status && (
            <span className={`inline-block mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[player.status] || 'bg-gray-100 text-gray-600'}`}>
              {player.status}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="px-4 pt-4 pb-2 -mt-5 bg-white rounded-t-2xl relative z-10">
          {(player.jerseyNumber || player.jerseySize) && (
            <div className="flex gap-2 mb-3">
              {player.jerseyNumber && (
                <div className="flex-1 bg-orange-50 border border-orange-100 rounded-xl p-2 text-center">
                  <p className="text-[9px] text-orange-400 uppercase tracking-widest font-semibold">Jersey No.</p>
                  <p className="text-xl font-black text-orange-600">#{player.jerseyNumber}</p>
                </div>
              )}
              {player.jerseySize && (
                <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl p-2 text-center">
                  <p className="text-[9px] text-amber-500 uppercase tracking-widest font-semibold">Jersey Size</p>
                  <p className="text-xl font-black text-amber-600">{player.jerseySize}</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
            {details.map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">{label}</span>
                <span className="text-xs text-gray-800 font-medium truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4 space-y-2">
          {/* Status controls */}
          <div className="flex gap-2">
            {player.status !== 'SOLD' && (
              <button onClick={() => handleStatus('SOLD')} disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-xl transition-colors disabled:opacity-50">
                ✅ Mark Sold
              </button>
            )}
            {player.status !== 'UNSOLD' && (
              <button onClick={() => handleStatus('UNSOLD')} disabled={loading}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold py-2 rounded-xl transition-colors disabled:opacity-50">
                ❌ Mark Unsold
              </button>
            )}
            {player.status !== 'AVAILABLE' && (
              <button onClick={() => handleStatus('AVAILABLE')} disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl transition-colors disabled:opacity-50">
                🔄 Available
              </button>
            )}
          </div>

          {/* Delete */}
          {!confirming ? (
            <button onClick={() => setConfirming(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-xl transition-colors text-sm border border-red-200">
              <FiTrash2 size={14} />
              {player.status === 'SOLD' ? 'Remove from Sold' : player.status === 'UNSOLD' ? 'Remove from Unsold' : 'Delete Player'}
            </button>
          ) : (
            <div className="space-y-1.5">
              <p className="text-xs text-center text-gray-500">
                {player.status === 'SOLD' || player.status === 'UNSOLD'
                  ? 'Player will be reset to Available and removed from the list.'
                  : 'This will permanently delete the player.'}
              </p>
              <div className="flex gap-2">
                <button onClick={handleDelete} disabled={loading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
                <button onClick={() => setConfirming(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl transition-colors text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
