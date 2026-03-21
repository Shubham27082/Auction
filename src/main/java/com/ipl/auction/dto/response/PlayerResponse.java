package com.ipl.auction.dto.response;

import com.ipl.auction.entity.enums.PlayerStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder
public class PlayerResponse {
    private Long id;
    private String playerName;
    private Integer age;
    private String role;
    private String nativePlace;
    private String currentAddress;
    private String teamRepresented;
    private LocalDate dob;
    private String phoneNumber;
    private BigDecimal basePrice;
    private String playerImage;
    private PlayerStatus status;
    private BigDecimal soldPrice;
    private Long soldToTeamId;
    private String soldToTeamName;
    private LocalDateTime createdAt;
}
