package com.ipl.auction.exception;

public class AuctionAlreadyActiveException extends RuntimeException {
    public AuctionAlreadyActiveException() {
        super("An auction is already active. Complete it before starting a new one.");
    }

    public AuctionAlreadyActiveException(String message) {
        super(message);
    }
}
