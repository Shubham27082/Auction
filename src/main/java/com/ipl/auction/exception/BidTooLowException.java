package com.ipl.auction.exception;

import java.math.BigDecimal;

public class BidTooLowException extends RuntimeException {
    public BidTooLowException(BigDecimal bidAmount, BigDecimal currentBid) {
        super(String.format("Bid amount %.2f must be greater than current bid %.2f", bidAmount, currentBid));
    }

    public BidTooLowException(String message) {
        super(message);
    }
}
