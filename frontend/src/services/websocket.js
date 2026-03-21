import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.min.js'

let client = null

export const connectWebSocket = (onMessage, onError) => {
  client = new Client({
    webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:8080'}/api/ws/auction`),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('WebSocket connected')
      client.subscribe('/topic/bids', (msg) => {
        try {
          onMessage(JSON.parse(msg.body))
        } catch (e) {
          console.error('WS parse error', e)
        }
      })
    },
    onStompError: (frame) => {
      console.error('STOMP error', frame)
      onError && onError(frame)
    },
    onDisconnect: () => console.log('WebSocket disconnected')
  })
  client.activate()
  return client
}

export const sendBid = (bidData) => {
  if (client?.connected) {
    client.publish({ destination: '/app/bid', body: JSON.stringify(bidData) })
  }
}

export const disconnectWebSocket = () => {
  if (client) {
    client.deactivate()
    client = null
  }
}
