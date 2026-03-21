package com.ipl.auction.repository;

import com.ipl.auction.entity.Player;
import com.ipl.auction.entity.enums.PlayerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByStatus(PlayerStatus status);
    List<Player> findBySoldToTeamId(Long teamId);
}
