import { formatCurrency, formatDate } from '../utils/format'
import { useAuction } from '../context/AuctionContext'
import { MdHistory } from 'react-icons/md'

export default function BidHistory() {
  const { bidHistory } = useAuction()

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MdHistory className="text-blue-400" size={20} />
        <h3 className="font-semibold text-white">Bid History</h3>
        <span className="ml-auto text-xs text-gray-500">{bidHistory.length} bids</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {bidHistory.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">No bids yet</p>
        )}
        {bidHistory.map((bid, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-2.5 rounded-lg text-sm
              ${i === 0 ? 'bg-yellow-900/30 border border-yellow-700/40' : 'bg-gray-800'}`}
          >
            <div>
              <p className="font-medium text-white">{bid.teamName || '—'}</p>
              <p className="text-xs text-gray-500">{formatDate(bid.bidTime)}</p>
            </div>
            <span className={`font-bold ${i === 0 ? 'text-yellow-400' : 'text-gray-300'}`}>
              {formatCurrency(bid.bidAmount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
