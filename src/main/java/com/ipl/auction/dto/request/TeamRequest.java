package com.ipl.auction.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TeamRequest {

    @NotBlank(message = "Team name is required")
    @Size(max = 150)
    private String teamName;

    @NotBlank(message = "Owner name is required")
    @Size(max = 150)
    private String ownerName;

    @NotNull(message = "Total purse is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total purse must be positive")
    private BigDecimal totalPurse;
}
