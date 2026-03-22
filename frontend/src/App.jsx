import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import PlayerPage from './pages/PlayerPage'
import PlayerDetailPage from './pages/PlayerDetailPage'
import Teams from './pages/Teams'
import AuctionLive from './pages/AuctionLive'
import SoldPlayers from './pages/SoldPlayers'
import UnsoldPlayers from './pages/UnsoldPlayers'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/"              element={<Dashboard />} />
        <Route path="/players"       element={<PlayerPage />} />
        <Route path="/players/:id"   element={<PlayerDetailPage />} />
        <Route path="/players/list"  element={<Players />} />
        <Route path="/teams"         element={<Teams />} />
        <Route path="/auction"       element={<AuctionLive />} />
        <Route path="/sold"          element={<SoldPlayers />} />
        <Route path="/unsold"        element={<UnsoldPlayers />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
