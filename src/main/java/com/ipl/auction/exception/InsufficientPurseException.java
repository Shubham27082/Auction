package com.ipl.auction.exception;

import java.math.BigDecimal;

public class InsufficientPurseException extends RuntimeException {
    public InsufficientPurseException(String teamName, BigDecimal required, BigDecimal available) {
        super(String.format("Team '%s' has insufficient purse. Required: %.2f, Available: %.2f",
                teamName, required, available));
    }

    public InsufficientPurseException(String message) {
        super(message);
    }
}
