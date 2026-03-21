package com.ipl.auction.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StartAuctionRequest {

    @NotNull(message = "Player ID is required")
    private Long playerId;
}
