package com.ipl.auction.controller;

import com.ipl.auction.dto.request.BidRequest;
import com.ipl.auction.dto.request.StartAuctionRequest;
import com.ipl.auction.dto.response.ApiResponse;
import com.ipl.auction.dto.response.AuctionResponse;
import com.ipl.auction.dto.response.BidResponse;
import com.ipl.auction.service.AuctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;

    // --- Admin Panel Controls ---

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<AuctionResponse>> startAuction(
            @Valid @RequestBody StartAuctionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Auction started", auctionService.startAuction(request)));
    }

    @PostMapping("/{id}/sold")
    public ResponseEntity<ApiResponse<AuctionResponse>> markSold(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Player marked as SOLD", auctionService.markSold(id)));
    }

    @PostMapping("/{id}/unsold")
    public ResponseEntity<ApiResponse<AuctionResponse>> markUnsold(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Player marked as UNSOLD", auctionService.markUnsold(id)));
    }

    // --- Bidding ---

    @PostMapping("/bid")
    public ResponseEntity<ApiResponse<BidResponse>> placeBid(@Valid @RequestBody BidRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Bid placed", auctionService.placeBid(request)));
    }

    // --- Query ---

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<AuctionResponse>> getActiveAuction() {
        return ResponseEntity.ok(ApiResponse.success(auctionService.getActiveAuction()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuctionResponse>> getAuctionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(auctionService.getAuctionById(id)));
    }

    @GetMapping("/{id}/bids")
    public ResponseEntity<ApiResponse<List<BidResponse>>> getBidHistory(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(auctionService.getBidHistory(id)));
    }
}
