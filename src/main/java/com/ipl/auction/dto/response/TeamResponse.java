package com.ipl.auction.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class TeamResponse {
    private Long id;
    private String teamName;
    private String teamLogo;
    private String ownerName;
    private String ownerImage;
    private BigDecimal totalPurse;
    private BigDecimal remainingPurse;
    private LocalDateTime createdAt;
    private List<PlayerResponse> purchasedPlayers;
}
