import { getPlayers } from '../api/players'
import useFetch from '../hooks/useFetch'
import { formatCurrency, imgUrl } from '../utils/format'
import { FiUser } from 'react-icons/fi'

export default function UnsoldPlayers() {
  const { data: players, loading } = useFetch(() => getPlayers('UNSOLD'))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Unsold Players</h1>
        <p className="text-gray-400 text-sm">{players?.length || 0} players unsold</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card animate-pulse h-24 bg-gray-800" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players?.map(p => (
            <div key={p.id} className="card border-red-900 hover:border-red-700 transition-colors">
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
                <span className="badge-unsold">UNSOLD</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800 text-sm">
                <p className="text-xs text-gray-500">Base Price</p>
                <p className="text-yellow-400 font-medium">{formatCurrency(p.basePrice)}</p>
              </div>
            </div>
          ))}
          {players?.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">No unsold players</p>}
        </div>
      )}
    </div>
  )
}
