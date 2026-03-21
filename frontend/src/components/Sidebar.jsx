import { NavLink } from 'react-router-dom'
import { MdDashboard, MdPeople, MdGroups, MdGavel, MdCheckCircle, MdCancel } from 'react-icons/md'
import { useAuction } from '../context/AuctionContext'

const links = [
  { to: '/',        label: 'Dashboard',     icon: MdDashboard },
  { to: '/players', label: 'Players',       icon: MdPeople },
  { to: '/teams',   label: 'Teams',         icon: MdGroups },
  { to: '/auction', label: 'Live Auction',  icon: MdGavel, live: true },
  { to: '/sold',    label: 'Sold Players',  icon: MdCheckCircle },
  { to: '/unsold',  label: 'Unsold Players',icon: MdCancel },
]

export default function Sidebar({ open }) {
  const { auction } = useAuction()
  const isLive = auction?.status === 'ACTIVE'

  if (!open) return null

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-4 shrink-0">
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, label, icon: Icon, live }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {live && isLive && (
              <span className="ml-auto flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
