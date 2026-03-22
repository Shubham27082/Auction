import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPlayerById, deletePlayer, updatePlayerStatus } from '../services/api'
import EditPlayerModal from '../components/EditPlayerModal'
import { resolveImage } from '../utils/format'
import { FiArrowLeft, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  AVAILABLE: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
  SOLD:      'bg-blue-400/20 text-blue-300 border border-blue-400/30',
  UNSOLD:    'bg-red-400/20 text-red-300 border border-red-400/30',
}

const ROLE_COLORS = {
  'Batsman':       'bg-blue-500/20 text-blue-300',
  'Bowler':        'bg-purple-500/20 text-purple-300',
  'All-Rounder':   'bg-teal-500/20 text-teal-300',
  'Wicket Keeper': 'bg-pink-500/20 text-pink-300',
}

const InfoRow = ({ label, value }) => value ? (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">{label}</span>
    <span className="text-white font-medium text-sm">{value}</span>
  </div>
) : null

export default function PlayerDetailPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [player,     setPlayer]     = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [editing,    setEditing]    = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [acting,     setActing]     = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchPlayerById(id)
      setPlayer(res.data.data)
    } catch {
      toast.error('Player not found')
      navigate('/players')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const handleStatus = async (status) => {
    setActing(true)
    try {
      await updatePlayerStatus(player.id, status)
      toast.success(`Marked as ${status}`)
      load()
    } catch { toast.error('Failed to update status') }
    finally { setActing(false) }
  }

  const handleDelete = async () => {
    setActing(true)
    try {
      if (player.status === 'SOLD' || player.status === 'UNSOLD') {
        await updatePlayerStatus(player.id, 'AVAILABLE')
        toast.success('Reset to Available')
        load()
      } else {
        await deletePlayer(player.id)
        toast.success('Player deleted')
        navigate('/players')
      }
    } catch { toast.error('Action failed') }
    finally { setActing(false); setConfirming(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!player) return null

  const image = resolveImage(player.playerImage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <button onClick={() => navigate('/players')}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium">
          <FiArrowLeft size={18} /> Back to Players
        </button>
        <button onClick={() => setEditing(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <FiEdit2 size={14} /> Edit Player
        </button>
      </div>

      {/* Full-screen content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Photo + identity */}
          <div className="flex flex-col items-center gap-4">
            {/* Big square photo */}
            <div className="w-full aspect-square max-w-xs bg-gradient-to-br from-orange-900/40 to-amber-900/40 border border-white/10 overflow-hidden rounded-2xl shadow-2xl">
              {image ? (
                <img src={image} alt={player.playerName} className="w-full h-full object-cover"
                  onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
              ) : null}
              <div className={`w-full h-full items-center justify-center ${image ? 'hidden' : 'flex'}`}>
                <FiUser size={80} className="text-white/20" />
              </div>
            </div>

            {/* Name + badges */}
            <div className="text-center">
              <h1 className="text-2xl font-black text-white">{player.playerName}</h1>
              {player.jerseyName && (
                <p className="text-white/50 text-sm mt-0.5">"{player.jerseyName}"</p>
              )}
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_COLORS[player.role] || 'bg-gray-700 text-gray-300'}`}>
                  {player.role}
                </span>
                {player.status && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[player.status]}`}>
                    {player.status}
                  </span>
                )}
              </div>
            </div>

            {/* Jersey highlight */}
            {(player.jerseyNumber || player.jerseySize) && (
              <div className="flex gap-3 w-full max-w-xs">
                {player.jerseyNumber && (
                  <div className="flex-1 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-orange-400 uppercase tracking-widest font-semibold">Jersey No.</p>
                    <p className="text-3xl font-black text-orange-400">#{player.jerseyNumber}</p>
                  </div>
                )}
                {player.jerseySize && (
                  <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">Jersey Size</p>
                    <p className="text-3xl font-black text-amber-400">{player.jerseySize}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — Details + Actions */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Details card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-4">Player Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <InfoRow label="Age"          value={player.age} />
                <InfoRow label="Village"      value={player.village || player.nativePlace} />
                <InfoRow label="Contact"      value={player.contactNo || player.phoneNumber} />
                <InfoRow label="Batting"      value={player.battingStyle} />
                <InfoRow label="Bowling"      value={player.bowlingStyle} />
                <InfoRow label="Jersey Name"  value={player.jerseyName} />
                <InfoRow label="Jersey No."   value={player.jerseyNumber ? `#${player.jerseyNumber}` : null} />
                <InfoRow label="Jersey Size"  value={player.jerseySize} />
                <InfoRow label="Team"         value={player.teamRepresented} />
              </div>
            </div>

            {/* Status controls */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-4">Status Controls</h2>
              <div className="flex flex-wrap gap-3">
                {player.status !== 'AVAILABLE' && (
                  <button onClick={() => handleStatus('AVAILABLE')} disabled={acting}
                    className="flex-1 min-w-[120px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm">
                    🔄 Mark Available
                  </button>
                )}
                {player.status !== 'SOLD' && (
                  <button onClick={() => handleStatus('SOLD')} disabled={acting}
                    className="flex-1 min-w-[120px] bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm">
                    ✅ Mark Sold
                  </button>
                )}
                {player.status !== 'UNSOLD' && (
                  <button onClick={() => handleStatus('UNSOLD')} disabled={acting}
                    className="flex-1 min-w-[120px] bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm">
                    ❌ Mark Unsold
                  </button>
                )}
              </div>
            </div>

            {/* Delete */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <h2 className="text-red-400/70 text-xs uppercase tracking-widest font-semibold mb-3">Danger Zone</h2>
              {!confirming ? (
                <button onClick={() => setConfirming(true)}
                  className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                  <FiTrash2 size={14} />
                  {player.status === 'SOLD' ? 'Remove from Sold' : player.status === 'UNSOLD' ? 'Remove from Unsold' : 'Delete Player'}
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-red-300/70 text-sm">
                    {player.status === 'SOLD' || player.status === 'UNSOLD'
                      ? 'Player will be reset to Available.'
                      : 'This will permanently delete the player.'}
                  </p>
                  <div className="flex gap-3">
                    <button onClick={handleDelete} disabled={acting}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                      {acting ? 'Processing...' : 'Confirm'}
                    </button>
                    <button onClick={() => setConfirming(false)}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <EditPlayerModal player={player} onClose={() => setEditing(false)} onSaved={load} />
      )}
    </div>
  )
}
