package com.ipl.auction.service;

import com.ipl.auction.dto.request.TeamRequest;
import com.ipl.auction.dto.response.PlayerResponse;
import com.ipl.auction.dto.response.TeamResponse;
import com.ipl.auction.entity.Team;
import com.ipl.auction.exception.ResourceNotFoundException;
import com.ipl.auction.repository.PlayerRepository;
import com.ipl.auction.repository.TeamRepository;
import com.ipl.auction.util.FileStorageUtil;
import com.ipl.auction.util.PlayerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeamService {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final FileStorageUtil fileStorageUtil;
    private final PlayerMapper playerMapper;

    @Transactional
    public TeamResponse createTeam(TeamRequest request) {
        if (teamRepository.existsByTeamName(request.getTeamName())) {
            throw new IllegalStateException("Team with name '" + request.getTeamName() + "' already exists");
        }
        Team team = Team.builder()
                .teamName(request.getTeamName())
                .ownerName(request.getOwnerName())
                .totalPurse(request.getTotalPurse())
                .remainingPurse(request.getTotalPurse())
                .build();
        team = teamRepository.save(team);
        log.info("Created team: {}", team.getTeamName());
        return toResponse(team, false);
    }

    @Transactional
    public TeamResponse uploadLogo(Long teamId, MultipartFile file, boolean isOwnerImage) throws IOException {
        Team team = getTeamEntity(teamId);
        String path = fileStorageUtil.storeFile(file, "teams");
        if (isOwnerImage) {
            team.setOwnerImage(path);
        } else {
            team.setTeamLogo(path);
        }
        return toResponse(teamRepository.save(team), false);
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(t -> toResponse(t, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public TeamResponse getTeamById(Long id) {
        Team team = getTeamEntity(id);
        List<PlayerResponse> players = playerRepository.findBySoldToTeamId(id)
                .stream().map(playerMapper::toResponse).toList();
        TeamResponse response = toResponse(team, false);
        response.setPurchasedPlayers(players);
        return response;
    }

    public Team getTeamEntity(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team", id));
    }

    private TeamResponse toResponse(Team team, boolean includePlayers) {
        return TeamResponse.builder()
                .id(team.getId())
                .teamName(team.getTeamName())
                .teamLogo(team.getTeamLogo())
                .ownerName(team.getOwnerName())
                .ownerImage(team.getOwnerImage())
                .totalPurse(team.getTotalPurse())
                .remainingPurse(team.getRemainingPurse())
                .createdAt(team.getCreatedAt())
                .build();
    }
}
