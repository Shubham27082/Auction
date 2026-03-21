package com.ipl.auction.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PlayerRequest {

    @NotBlank(message = "Player name is required")
    @Size(max = 150)
    private String playerName;

    @NotNull(message = "Age is required")
    @Min(value = 15, message = "Age must be at least 15")
    @Max(value = 60, message = "Age must be at most 60")
    private Integer age;

    @NotBlank(message = "Role is required")
    @Size(max = 100)
    private String role;

    @Size(max = 150)
    private String nativePlace;

    @Size(max = 500)
    private String currentAddress;

    @Size(max = 150)
    private String teamRepresented;

    private LocalDate dob;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String phoneNumber;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be positive")
    private BigDecimal basePrice;
}
