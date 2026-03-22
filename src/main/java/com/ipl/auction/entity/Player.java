package com.ipl.auction.entity;

import com.ipl.auction.entity.enums.PlayerStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "player")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_name", nullable = false, length = 150)
    private String playerName;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false, length = 100)
    private String role;

    @Column(name = "native_place", length = 150)
    private String nativePlace;

    @Column(name = "current_address", length = 500)
    private String currentAddress;

    @Column(name = "team_represented", length = 150)
    private String teamRepresented;

    private LocalDate dob;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "contact_no", length = 20)
    private String contactNo;

    @Column(name = "village", length = 150)
    private String village;

    @Column(name = "batting_style", length = 100)
    private String battingStyle;

    @Column(name = "bowling_style", length = 100)
    private String bowlingStyle;

    @Column(name = "jersey_name", length = 100)
    private String jerseyName;

    @Column(name = "jersey_number", length = 10)
    private String jerseyNumber;

    @Column(name = "jersey_size", length = 10)
    private String jerseySize;

    @Column(name = "base_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "player_image", length = 500)
    private String playerImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PlayerStatus status = PlayerStatus.AVAILABLE;

    @Column(name = "sold_price", precision = 15, scale = 2)
    private BigDecimal soldPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sold_to_team_id")
    private Team soldToTeam;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
