import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { connectWebSocket, disconnectWebSocket } from '../services/websocket'
import { getActive } from '../api/auction'

const AuctionContext = createContext(null)

export function AuctionProvider({ children }) {
  const [auction,    setAuction]    = useState(null)
  const [bidHistory, setBidHistory] = useState([])
  const [wsConnected,setWsConnected]= useState(false)
  const [bidFlash,   setBidFlash]   = useState(false)
  const flashTimer = useRef(null)

  const triggerFlash = () => {
    setBidFlash(true)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setBidFlash(false), 700)
  }

  const handleWsMessage = useCallback((msg) => {
    setAuction(prev => ({
      ...prev,
      currentBid:        msg.currentBid,
      highestBidTeamId:  msg.highestBidTeamId,
      highestBidTeamName:msg.highestBidTeamName,
      status:            msg.auctionStatus,
    }))
    setBidHistory(prev => [{
      teamName:  msg.highestBidTeamName,
      bidAmount: msg.currentBid,
      bidTime:   msg.timestamp,
    }, ...prev].slice(0, 20))
    triggerFlash()
  }, [])

  const connectWs = useCallback(() => {
    connectWebSocket(handleWsMessage, () => setWsConnected(false))
    setWsConnected(true)
  }, [handleWsMessage])

  const fetchActive = useCallback(async () => {
    try {
      const res = await getActive()
      setAuction(res.data.data)
    } catch {
      setAuction(null)
    }
  }, [])

  useEffect(() => {
    connectWs()
    fetchActive()
    return () => disconnectWebSocket()
  }, [])

  return (
    <AuctionContext.Provider value={{
      auction, setAuction,
      bidHistory, setBidHistory,
      wsConnected, bidFlash,
      fetchActive
    }}>
      {children}
    </AuctionContext.Provider>
  )
}

export const useAuction = () => useContext(AuctionContext)
