import { formatCurrency, imgUrl } from '../utils/format'
import { FiUser } from 'react-icons/fi'

const statusClass = { AVAILABLE: 'badge-available', SOLD: 'badge-sold', UNSOLD: 'badge-unsold' }

export default function PlayerCard({ player, onClick }) {
  return (
    <div
      onClick={() => onClick?.(player)}
      className="card hover:border-blue-600 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-800 overflow-hidden shrink-0 border-2 border-gray-700 group-hover:border-blue-500 transition-colors">
          {imgUrl(player.playerImage)
            ? <img src={imgUrl(player.playerImage)} alt={player.playerName} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-500"><FiUser size={24} /></div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{player.playerName}</p>
          <p className="text-xs text-gray-400">{player.role}</p>
          <p className="text-xs text-yellow-400 mt-0.5">{formatCurrency(player.basePrice)}</p>
        </div>
        <span className={statusClass[player.status] || 'badge-available'}>{player.status}</span>
      </div>
      {player.status === 'SOLD' && (
        <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between text-xs text-gray-400">
          <span>Sold to: <span className="text-green-400">{player.soldToTeamName}</span></span>
          <span>{formatCurrency(player.soldPrice)}</span>
        </div>
      )}
    </div>
  )
}
