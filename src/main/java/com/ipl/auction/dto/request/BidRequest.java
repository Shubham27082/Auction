package com.ipl.auction.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class BidRequest {

    @NotNull(message = "Auction ID is required")
    private Long auctionId;

    @NotNull(message = "Team ID is required")
    private Long teamId;

    @NotNull(message = "Bid amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Bid amount must be positive")
    private BigDecimal bidAmount;
}
