package com.ipl.auction.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "team")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "team_name", nullable = false, unique = true, length = 150)
    private String teamName;

    @Column(name = "team_logo", length = 500)
    private String teamLogo;

    @Column(name = "owner_name", nullable = false, length = 150)
    private String ownerName;

    @Column(name = "owner_image", length = 500)
    private String ownerImage;

    @Column(name = "total_purse", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalPurse;

    @Column(name = "remaining_purse", nullable = false, precision = 15, scale = 2)
    private BigDecimal remainingPurse;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "soldToTeam", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Player> purchasedPlayers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.remainingPurse == null) {
            this.remainingPurse = this.totalPurse;
        }
    }
}
