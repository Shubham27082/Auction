package com.ipl.auction.dto.websocket;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class BidUpdateMessage {
    private Long auctionId;
    private Long playerId;
    private String playerName;
    private String playerImage;
    private BigDecimal currentBid;
    private Long highestBidTeamId;
    private String highestBidTeamName;
    private String auctionStatus;
    private LocalDateTime timestamp;
}
