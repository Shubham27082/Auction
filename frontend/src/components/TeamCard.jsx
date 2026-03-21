import { formatCurrency, imgUrl } from '../utils/format'
import { MdGroups } from 'react-icons/md'

export default function TeamCard({ team, highlight, onClick }) {
  const pct = team.totalPurse > 0
    ? Math.round((team.remainingPurse / team.totalPurse) * 100)
    : 0

  return (
    <div
      onClick={() => onClick?.(team)}
      className={`card cursor-pointer transition-all duration-300
        ${highlight ? 'border-yellow-400 shadow-yellow-400/20 shadow-lg scale-105' : 'hover:border-blue-600'}`}
    >
      {highlight && (
        <div className="text-xs text-yellow-400 font-bold mb-2 flex items-center gap-1">
          <span className="animate-pulse">🏆</span> Highest Bidder
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden shrink-0">
          {imgUrl(team.teamLogo)
            ? <img src={imgUrl(team.teamLogo)} alt={team.teamName} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-gray-500"><MdGroups size={22} /></div>
          }
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{team.teamName}</p>
          <p className="text-xs text-gray-400">{team.ownerName}</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Remaining Purse</span>
          <span className="text-green-400 font-medium">{formatCurrency(team.remainingPurse)}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Total: {formatCurrency(team.totalPurse)}</span>
          <span>{pct}% left</span>
        </div>
      </div>
    </div>
  )
}
