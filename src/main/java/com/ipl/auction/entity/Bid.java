package com.ipl.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bid")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "bid_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal bidAmount;

    @Column(name = "bid_time")
    private LocalDateTime bidTime;

    @PrePersist
    protected void onCreate() {
        this.bidTime = LocalDateTime.now();
    }
}
