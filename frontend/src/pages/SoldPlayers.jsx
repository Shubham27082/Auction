import { getPlayers } from '../api/players'
import useFetch from '../hooks/useFetch'
import { formatCurrency, imgUrl } from '../utils/format'
import { FiUser } from 'react-icons/fi'

export default function SoldPlayers() {
  const { data: players, loading } = useFetch(() => getPlayers('SOLD'))

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
            <div key={p.id} className="card border-green-800 hover:border-green-600 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden shrink-0">
                  {imgUrl(p.playerImage)
                    ? <img src={imgUrl(p.playerImage)} alt={p.playerName} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-500"><FiUser size={20} /></div>
                  }
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{p.playerName}</p>
                  <p className="text-xs text-gray-400">{p.role}</p>
                </div>
                <span className="badge-sold">SOLD</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Sold To</p>
                  <p className="text-green-400 font-medium">{p.soldToTeamName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Sold Price</p>
                  <p className="text-yellow-400 font-bold">{formatCurrency(p.soldPrice)}</p>
                </div>
              </div>
            </div>
          ))}
          {players?.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">No sold players yet</p>}
        </div>
      )}
    </div>
  )
}
