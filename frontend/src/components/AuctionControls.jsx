import { useState } from 'react'
import { startAuction, placeBid, markSold, markUnsold } from '../api/auction'
import { useAuction } from '../context/AuctionContext'
import { formatCurrency } from '../utils/format'
import toast from 'react-hot-toast'

export default function AuctionControls({ players, teams, onUpdate }) {
  const { auction, fetchActive } = useAuction()
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [selectedTeam,   setSelectedTeam]   = useState('')
  const [bidAmount,      setBidAmount]       = useState('')
  const [loading,        setLoading]         = useState(false)

  const isActive = auction?.status === 'ACTIVE'

  const handle = async (fn, successMsg) => {
    setLoading(true)
    try {
      await fn()
      toast.success(successMsg)
      await fetchActive()
      onUpdate?.()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-white text-lg border-b border-gray-800 pb-3">
        🎛️ Auction Controls
      </h3>

      {/* Start Auction */}
      {!isActive && (
        <div className="space-y-2">
          <label className="label">Select Player to Auction</label>
          <select
            className="input"
            value={selectedPlayer}
            onChange={e => setSelectedPlayer(e.target.value)}
          >
            <option value="">-- Select Player --</option>
            {players?.filter(p => p.status === 'AVAILABLE').map(p => (
              <option key={p.id} value={p.id}>
                {p.playerName} — {formatCurrency(p.basePrice)}
              </option>
            ))}
          </select>
          <button
            className="btn-primary w-full"
            disabled={!selectedPlayer || loading}
            onClick={() => handle(() => startAuction(Number(selectedPlayer)), 'Auction started!')}
          >
            🚀 Start Auction
          </button>
        </div>
      )}

      {/* Place Bid */}
      {isActive && (
        <div className="space-y-2">
          <label className="label">Place Bid</label>
          <select className="input" value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
            <option value="">-- Select Team --</option>
            {teams?.map(t => (
              <option key={t.id} value={t.id}>
                {t.teamName} (₹{formatCurrency(t.remainingPurse)} left)
              </option>
            ))}
          </select>
          <input
            type="number"
            className="input"
            placeholder={`Min: ${formatCurrency((auction?.currentBid || 0) + 100000)}`}
            value={bidAmount}
            onChange={e => setBidAmount(e.target.value)}
          />
          <button
            className="btn-warning w-full"
            disabled={!selectedTeam || !bidAmount || loading}
            onClick={() => handle(
              () => placeBid({ auctionId: auction.id, teamId: Number(selectedTeam), bidAmount: Number(bidAmount) }),
              'Bid placed!'
            )}
          >
            💰 Place Bid
          </button>
        </div>
      )}

      {/* Sold / Unsold */}
      {isActive && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800">
          <button
            className="btn-success"
            disabled={loading || !auction?.highestBidTeamId}
            onClick={() => handle(() => markSold(auction.id), '🎉 Player SOLD!')}
          >
            ✅ Mark SOLD
          </button>
          <button
            className="btn-danger"
            disabled={loading}
            onClick={() => handle(() => markUnsold(auction.id), 'Player marked UNSOLD')}
          >
            ❌ Mark UNSOLD
          </button>
        </div>
      )}
    </div>
  )
}
