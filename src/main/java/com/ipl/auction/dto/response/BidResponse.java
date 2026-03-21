package com.ipl.auction.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class BidResponse {
    private Long id;
    private Long auctionId;
    private Long teamId;
    private String teamName;
    private BigDecimal bidAmount;
    private LocalDateTime bidTime;
}
