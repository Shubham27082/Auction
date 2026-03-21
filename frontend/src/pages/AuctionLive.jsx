import { useEffect, useState } from 'react'
import { useAuction } from '../context/AuctionContext'
import { getPlayers } from '../api/players'
import { getTeams }   from '../api/teams'
import { getBidHistory } from '../api/auction'
import AuctionControls from '../components/AuctionControls'
import BidHistory from '../components/BidHistory'
import TeamCard from '../components/TeamCard'
import Timer from '../components/Timer'
import { formatCurrency, imgUrl } from '../utils/format'
import { FiUser } from 'react-icons/fi'

export default function AuctionLive() {
  const { auction, bidFlash, fetchActive, setBidHistory } = useAuction()
  const [players, setPlayers] = useState([])
  const [teams,   setTeams]   = useState([])

  const loadAll = async () => {
    const [pr, tr] = await Promise.all([getPlayers(), getTeams()])
    setPlayers(pr.data.data || [])
    setTeams(tr.data.data || [])
  }

  useEffect(() => {
    loadAll()
    fetchActive()
  }, [])

  // Load bid history when auction changes
  useEffect(() => {
    if (auction?.id) {
      getBidHistory(auction.id).then(r => setBidHistory(r.data.data || []))
    }
  }, [auction?.id])

  const isActive = auction?.status === 'ACTIVE'
  const player   = auction?.player

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🔴 Live Auction
          {isActive && <span className="text-sm font-normal bg-red-600 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>}
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Left: Player + Bid Display */}
        <div className="xl:col-span-2 space-y-5">

          {/* Current Player Card */}
          <div className={`card transition-all duration-300 ${bidFlash ? 'animate-bid-flash' : ''}`}>
            {!isActive && !player ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-3">🏏</p>
                <p className="text-lg font-medium">No Active Auction</p>
                <p className="text-sm mt-1">Start an auction from the controls panel</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Player Image */}
                <div className="w-32 h-32 rounded-2xl bg-gray-800 overflow-hidden border-2 border-gray-700 shrink-0">
                  {imgUrl(player?.playerImage)
                    ? <img src={imgUrl(player.playerImage)} alt={player.playerName} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-500"><FiUser size={40} /></div>
                  }
                </div>

                {/* Player Info */}
                <div className="flex-1 text-center md:text-left">
                  <p className="text-3xl font-bold text-white">{player?.playerName}</p>
                  <p className="text-gray-400 mt-1">{player?.role} · {player?.teamRepresented}</p>
                  <p className="text-sm text-gray-500 mt-1">Base Price: <span className="text-yellow-400">{formatCurrency(player?.basePrice)}</span></p>

                  {/* Current Bid */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Current Bid</p>
                    <p className={`text-5xl font-black mt-1 transition-all duration-300 ${bidFlash ? 'text-yellow-300 scale-110' : 'text-yellow-400'}`}>
                      {formatCurrency(auction?.currentBid)}
                    </p>
                    {auction?.highestBidTeamName && (
                      <p className="text-sm text-green-400 mt-1">
                        🏆 Leading: <span className="font-semibold">{auction.highestBidTeamName}</span>
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  {auction?.status === 'COMPLETED' && (
                    <div className="mt-4 inline-block animate-sold-pop">
                      {player?.status === 'SOLD'
                        ? <span className="bg-green-600 text-white px-4 py-1.5 rounded-full font-bold text-lg">✅ SOLD!</span>
                        : <span className="bg-red-600 text-white px-4 py-1.5 rounded-full font-bold text-lg">❌ UNSOLD</span>
                      }
                    </div>
                  )}
                </div>

                {/* Timer */}
                <div className="shrink-0">
                  <Timer active={isActive} onExpire={() => {}} />
                </div>
              </div>
            )}
          </div>

          {/* Teams Grid */}
          <div>
            <h3 className="font-semibold text-white mb-3">Teams</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {teams.map(t => (
                <TeamCard
                  key={t.id}
                  team={t}
                  highlight={auction?.highestBidTeamId === t.id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Controls + Bid History */}
        <div className="space-y-5">
          <AuctionControls players={players} teams={teams} onUpdate={loadAll} />
          <div className="h-80">
            <BidHistory />
          </div>
        </div>
      </div>
    </div>
  )
}
