package com.ipl.auction.websocket;

import com.ipl.auction.dto.request.BidRequest;
import com.ipl.auction.dto.response.BidResponse;
import com.ipl.auction.service.AuctionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class AuctionWebSocketController {

    private final AuctionService auctionService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Clients can send bids via WebSocket to /app/bid
     * Broadcast is handled inside AuctionService to /topic/bids
     */
    @MessageMapping("/bid")
    public void handleBid(BidRequest request) {
        try {
            BidResponse response = auctionService.placeBid(request);
            log.debug("WebSocket bid processed: {}", response);
        } catch (Exception e) {
            log.warn("WebSocket bid error: {}", e.getMessage());
            messagingTemplate.convertAndSend("/topic/errors", e.getMessage());
        }
    }
}
