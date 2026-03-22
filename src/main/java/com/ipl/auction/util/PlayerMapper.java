package com.ipl.auction.util;

import com.ipl.auction.dto.response.PlayerResponse;
import com.ipl.auction.entity.Player;
import org.springframework.stereotype.Component;

@Component
public class PlayerMapper {

    public PlayerResponse toResponse(Player player) {
        if (player == null) return null;
        return PlayerResponse.builder()
                .id(player.getId())
                .playerName(player.getPlayerName())
                .age(player.getAge())
                .role(player.getRole())
                .nativePlace(player.getNativePlace())
                .currentAddress(player.getCurrentAddress())
                .teamRepresented(player.getTeamRepresented())
                .dob(player.getDob())
                .phoneNumber(player.getPhoneNumber())
                .contactNo(player.getContactNo())
                .village(player.getVillage())
                .battingStyle(player.getBattingStyle())
                .bowlingStyle(player.getBowlingStyle())
                .jerseyName(player.getJerseyName())
                .jerseyNumber(player.getJerseyNumber())
                .jerseySize(player.getJerseySize())
                .basePrice(player.getBasePrice())
                .playerImage(player.getPlayerImage())
                .status(player.getStatus())
                .soldPrice(player.getSoldPrice())
                .soldToTeamId(player.getSoldToTeam() != null ? player.getSoldToTeam().getId() : null)
                .soldToTeamName(player.getSoldToTeam() != null ? player.getSoldToTeam().getTeamName() : null)
                .createdAt(player.getCreatedAt())
                .build();
    }
}
