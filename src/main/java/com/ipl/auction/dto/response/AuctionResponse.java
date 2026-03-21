package com.ipl.auction.dto.response;

import com.ipl.auction.entity.enums.AuctionStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class AuctionResponse {
    private Long id;
    private PlayerResponse player;
    private BigDecimal currentBid;
    private Long highestBidTeamId;
    private String highestBidTeamName;
    private AuctionStatus status;
    private LocalDateTime createdAt;
}
