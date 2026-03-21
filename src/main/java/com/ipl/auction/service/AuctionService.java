package com.ipl.auction.service;

import com.ipl.auction.dto.request.BidRequest;
import com.ipl.auction.dto.request.StartAuctionRequest;
import com.ipl.auction.dto.response.AuctionResponse;
import com.ipl.auction.dto.response.BidResponse;
import com.ipl.auction.dto.websocket.BidUpdateMessage;
import com.ipl.auction.entity.*;
import com.ipl.auction.entity.enums.AuctionStatus;
import com.ipl.auction.entity.enums.PlayerStatus;
import com.ipl.auction.exception.*;
import com.ipl.auction.repository.*;
import com.ipl.auction.util.PlayerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final PlayerService playerService;
    private final TeamService teamService;
    private final SimpMessagingTemplate messagingTemplate;
    private final PlayerMapper playerMapper;

    @Transactional
    public AuctionResponse startAuction(StartAuctionRequest request) {
        if (auctionRepository.existsByStatus(AuctionStatus.ACTIVE)) {
            throw new AuctionAlreadyActiveException();
        }

        Player player = playerService.getPlayerEntity(request.getPlayerId());

        if (player.getStatus() != PlayerStatus.AVAILABLE) {
            throw new IllegalStateException("Player '" + player.getPlayerName() + "' is not available for auction");
        }

        Auction auction = Auction.builder()
                .player(player)
                .currentBid(player.getBasePrice())
                .status(AuctionStatus.ACTIVE)
                .build();

        auction = auctionRepository.save(auction);
        log.info("Auction started for player: {} (id={})", player.getPlayerName(), player.getId());

        broadcastUpdate(auction);
        return toResponse(auction);
    }

    @Transactional
    public BidResponse placeBid(BidRequest request) {
        // Pessimistic lock to prevent race conditions
        Auction auction = auctionRepository.findByIdWithLock(request.getAuctionId())
                .orElseThrow(() -> new ResourceNotFoundException("Auction", request.getAuctionId()));

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new IllegalStateException("Auction is not active");
        }

        if (request.getBidAmount().compareTo(auction.getCurrentBid()) <= 0) {
            throw new BidTooLowException(request.getBidAmount(), auction.getCurrentBid());
        }

        Team team = teamService.getTeamEntity(request.getTeamId());

        if (team.getRemainingPurse().compareTo(request.getBidAmount()) < 0) {
            throw new InsufficientPurseException(team.getTeamName(), request.getBidAmount(), team.getRemainingPurse());
        }

        Bid bid = Bid.builder()
                .auction(auction)
                .team(team)
                .bidAmount(request.getBidAmount())
                .bidTime(LocalDateTime.now())
                .build();
        bid = bidRepository.save(bid);

        auction.setCurrentBid(request.getBidAmount());
        auction.setHighestBidTeam(team);
        auctionRepository.save(auction);

        log.info("Bid placed: team={}, amount={}, auctionId={}", team.getTeamName(), request.getBidAmount(), auction.getId());

        broadcastUpdate(auction);

        return BidResponse.builder()
                .id(bid.getId())
                .auctionId(auction.getId())
                .teamId(team.getId())
                .teamName(team.getTeamName())
                .bidAmount(bid.getBidAmount())
                .bidTime(bid.getBidTime())
                .build();
    }

    @Transactional
    public AuctionResponse markSold(Long auctionId) {
        Auction auction = auctionRepository.findByIdWithLock(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction", auctionId));

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new IllegalStateException("Auction is not active");
        }
        if (auction.getHighestBidTeam() == null) {
            throw new IllegalStateException("No bids placed. Cannot mark as sold.");
        }

        Team winningTeam = auction.getHighestBidTeam();
        BigDecimal soldPrice = auction.getCurrentBid();

        // Deduct purse
        winningTeam.setRemainingPurse(winningTeam.getRemainingPurse().subtract(soldPrice));

        // Update player
        Player player = auction.getPlayer();
        player.setStatus(PlayerStatus.SOLD);
        player.setSoldPrice(soldPrice);
        player.setSoldToTeam(winningTeam);

        auction.setStatus(AuctionStatus.COMPLETED);

        log.info("Player {} SOLD to {} for {}", player.getPlayerName(), winningTeam.getTeamName(), soldPrice);

        broadcastUpdate(auction);
        return toResponse(auction);
    }

    @Transactional
    public AuctionResponse markUnsold(Long auctionId) {
        Auction auction = auctionRepository.findByIdWithLock(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction", auctionId));

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new IllegalStateException("Auction is not active");
        }

        Player player = auction.getPlayer();
        player.setStatus(PlayerStatus.UNSOLD);
        auction.setStatus(AuctionStatus.COMPLETED);

        log.info("Player {} marked UNSOLD", player.getPlayerName());

        broadcastUpdate(auction);
        return toResponse(auction);
    }

    @Transactional(readOnly = true)
    public AuctionResponse getActiveAuction() {
        Auction auction = auctionRepository.findByStatus(AuctionStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("No active auction found"));
        return toResponse(auction);
    }

    @Transactional(readOnly = true)
    public AuctionResponse getAuctionById(Long id) {
        return toResponse(auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction", id)));
    }

    @Transactional(readOnly = true)
    public List<BidResponse> getBidHistory(Long auctionId) {
        return bidRepository.findByAuctionIdOrderByBidTimeDesc(auctionId).stream()
                .map(b -> BidResponse.builder()
                        .id(b.getId())
                        .auctionId(auctionId)
                        .teamId(b.getTeam().getId())
                        .teamName(b.getTeam().getTeamName())
                        .bidAmount(b.getBidAmount())
                        .bidTime(b.getBidTime())
                        .build())
                .toList();
    }

    private void broadcastUpdate(Auction auction) {
        BidUpdateMessage message = BidUpdateMessage.builder()
                .auctionId(auction.getId())
                .playerId(auction.getPlayer().getId())
                .playerName(auction.getPlayer().getPlayerName())
                .playerImage(auction.getPlayer().getPlayerImage())
                .currentBid(auction.getCurrentBid())
                .highestBidTeamId(auction.getHighestBidTeam() != null ? auction.getHighestBidTeam().getId() : null)
                .highestBidTeamName(auction.getHighestBidTeam() != null ? auction.getHighestBidTeam().getTeamName() : null)
                .auctionStatus(auction.getStatus().name())
                .timestamp(LocalDateTime.now())
                .build();

        messagingTemplate.convertAndSend("/topic/bids", message);
        log.debug("Broadcast bid update for auction {}", auction.getId());
    }

    private AuctionResponse toResponse(Auction auction) {
        return AuctionResponse.builder()
                .id(auction.getId())
                .player(playerMapper.toResponse(auction.getPlayer()))
                .currentBid(auction.getCurrentBid())
                .highestBidTeamId(auction.getHighestBidTeam() != null ? auction.getHighestBidTeam().getId() : null)
                .highestBidTeamName(auction.getHighestBidTeam() != null ? auction.getHighestBidTeam().getTeamName() : null)
                .status(auction.getStatus())
                .createdAt(auction.getCreatedAt())
                .build();
    }
}
