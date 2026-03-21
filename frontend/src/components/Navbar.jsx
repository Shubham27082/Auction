import { useAuth } from '../context/AuthContext'
import { useAuction } from '../context/AuctionContext'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiLogOut, FiWifi, FiWifiOff } from 'react-icons/fi'

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const { wsConnected }  = useAuction()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="text-gray-400 hover:text-white transition-colors">
          <FiMenu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-xl">🏏</span>
          <span className="font-bold text-lg text-white tracking-wide">IPL Auction</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${wsConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
          {wsConnected ? <FiWifi size={12} /> : <FiWifiOff size={12} />}
          {wsConnected ? 'Live' : 'Offline'}
        </div>
        <span className="text-sm text-gray-400">{user?.username}</span>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors" title="Logout">
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  )
}
