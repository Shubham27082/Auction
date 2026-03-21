package com.ipl.auction.entity;

import com.ipl.auction.entity.enums.AuctionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "auction")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(name = "current_bid", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentBid;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "highest_bid_team_id")
    private Team highestBidTeam;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AuctionStatus status = AuctionStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Bid> bids = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
