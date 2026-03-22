import { FiEdit2, FiUser } from 'react-icons/fi'
import { resolveImage } from '../utils/format'

const ROLE_COLORS = {
  'Batsman':       'bg-blue-100 text-blue-700',
  'Bowler':        'bg-purple-100 text-purple-700',
  'All-Rounder':   'bg-teal-100 text-teal-700',
  'Wicket Keeper': 'bg-pink-100 text-pink-700',
}

const STATUS_STYLES = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  SOLD:      'bg-blue-100 text-blue-700',
  UNSOLD:    'bg-red-100 text-red-700',
}

export default function PlayerCard({ player, onClick, onEdit }) {
  const image = resolveImage(player.playerImage)

  return (
    <div
      onClick={() => onClick(player)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden relative"
    >
      {/* Edit button */}
      <button
        onClick={e => { e.stopPropagation(); onEdit(player) }}
        className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-orange-500 hover:text-white text-gray-500 p-1.5 rounded-full shadow transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Edit"
      >
        <FiEdit2 size={13} />
      </button>

      {/* Status badge */}
      {player.status && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[player.status] || 'bg-gray-100 text-gray-600'}`}>
            {player.status}
          </span>
        </div>
      )}

      {/* Square image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={player.playerName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.onerror = null; e.target.src = '' ; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div className={`absolute inset-0 items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 ${image ? 'hidden' : 'flex'}`}>
          <FiUser size={48} className="text-blue-300" />
        </div>

        {/* Jersey number overlay */}
        {player.jerseyNumber && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-black px-2 py-0.5 rounded-lg">
            #{player.jerseyNumber}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base truncate">{player.playerName}</h3>
        {player.jerseyName && (
          <p className="text-xs text-gray-400 truncate mt-0.5">"{player.jerseyName}"</p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[player.role] || 'bg-gray-100 text-gray-600'}`}>
            {player.role}
          </span>
          <span className="text-xs text-gray-400">Age {player.age}</span>
          {player.village && (
            <span className="text-xs text-gray-400 truncate">📍 {player.village}</span>
          )}
        </div>
      </div>
    </div>
  )
}
