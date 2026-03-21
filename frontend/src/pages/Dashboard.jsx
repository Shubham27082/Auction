import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlayers } from '../api/players'
import { getTeams }   from '../api/teams'
import { useAuction } from '../context/AuctionContext'
import { formatCurrency } from '../utils/format'
import { MdPeople, MdGroups, MdGavel, MdCheckCircle, MdCancel } from 'react-icons/md'

export default function Dashboard() {
  const [players, setPlayers] = useState([])
  const [teams,   setTeams]   = useState([])
  const { auction } = useAuction()

  useEffect(() => {
    getPlayers().then(r => setPlayers(r.data.data || []))
    getTeams().then(r => setTeams(r.data.data || []))
  }, [])

  const available = players.filter(p => p.status === 'AVAILABLE').length
  const sold      = players.filter(p => p.status === 'SOLD').length
  const unsold    = players.filter(p => p.status === 'UNSOLD').length

  const stats = [
    { label: 'Total Players',  value: players.length, icon: MdPeople,      color: 'blue',   to: '/players' },
    { label: 'Total Teams',    value: teams.length,   icon: MdGroups,      color: 'purple', to: '/teams' },
    { label: 'Available',      value: available,      icon: MdGavel,       color: 'yellow', to: '/players?status=AVAILABLE' },
    { label: 'Sold Players',   value: sold,           icon: MdCheckCircle, color: 'green',  to: '/sold' },
    { label: 'Unsold Players', value: unsold,         icon: MdCancel,      color: 'red',    to: '/unsold' },
  ]

  const colorMap = {
    blue:   'bg-blue-900/40 text-blue-400 border-blue-800',
    purple: 'bg-purple-900/40 text-purple-400 border-purple-800',
    yellow: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
    green:  'bg-green-900/40 text-green-400 border-green-800',
    red:    'bg-red-900/40 text-red-400 border-red-800',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">IPL Auction System Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to} className={`card border hover:scale-105 transition-transform ${colorMap[color]}`}>
            <Icon size={28} className="mb-2" />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs mt-0.5 opacity-80">{label}</p>
          </Link>
        ))}
      </div>

      {/* Active Auction Banner */}
      {auction?.status === 'ACTIVE' && (
        <Link to="/auction" className="block card border border-yellow-600 bg-yellow-900/20 hover:bg-yellow-900/30 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <div>
                <p className="font-bold text-yellow-400">🔴 LIVE AUCTION IN PROGRESS</p>
                <p className="text-sm text-gray-300">{auction.player?.playerName} — Current Bid: <span className="text-yellow-400 font-bold">{formatCurrency(auction.currentBid)}</span></p>
              </div>
            </div>
            <span className="btn-warning text-sm">View Live →</span>
          </div>
        </Link>
      )}

      {/* Teams Overview */}
      {teams.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Teams Purse Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => {
              const pct = team.totalPurse > 0 ? Math.round((team.remainingPurse / team.totalPurse) * 100) : 0
              return (
                <div key={team.id} className="card">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">{team.teamName}</span>
                    <span className="text-green-400 text-sm font-bold">{formatCurrency(team.remainingPurse)}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{pct}% remaining of {formatCurrency(team.totalPurse)}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
