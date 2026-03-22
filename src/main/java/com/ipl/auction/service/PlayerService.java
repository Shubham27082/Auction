package com.ipl.auction.service;

import com.ipl.auction.dto.request.PlayerRequest;
import com.ipl.auction.dto.response.PlayerResponse;
import com.ipl.auction.entity.Player;
import com.ipl.auction.entity.enums.PlayerStatus;
import com.ipl.auction.exception.ResourceNotFoundException;
import com.ipl.auction.repository.PlayerRepository;
import com.ipl.auction.util.ExcelImportUtil;
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
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final FileStorageUtil fileStorageUtil;
    private final ExcelImportUtil excelImportUtil;
    private final PlayerMapper playerMapper;

    @Transactional
    public PlayerResponse createPlayer(PlayerRequest request) {
        Player player = buildPlayer(request);
        player = playerRepository.save(player);
        log.info("Created player: {}", player.getPlayerName());
        return playerMapper.toResponse(player);
    }

    @Transactional
    public PlayerResponse uploadPlayerImage(Long playerId, MultipartFile file) throws IOException {
        Player player = getPlayerEntity(playerId);
        String path = fileStorageUtil.storeFile(file, "players");
        player.setPlayerImage(path);
        return playerMapper.toResponse(playerRepository.save(player));
    }

    @Transactional
    public List<PlayerResponse> importFromExcel(MultipartFile file) throws IOException {
        List<PlayerRequest> requests = excelImportUtil.parsePlayersFromExcel(file);
        List<Player> players = requests.stream().map(this::buildPlayer).toList();
        players = playerRepository.saveAll(players);
        log.info("Imported {} players from Excel", players.size());
        return players.stream().map(playerMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PlayerResponse> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(playerMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PlayerResponse> getPlayersByStatus(PlayerStatus status) {
        return playerRepository.findByStatus(status).stream()
                .map(playerMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PlayerResponse getPlayerById(Long id) {
        return playerMapper.toResponse(getPlayerEntity(id));
    }

    @Transactional
    public PlayerResponse updatePlayer(Long id, PlayerRequest request) {
        Player player = getPlayerEntity(id);
        player.setPlayerName(request.getPlayerName());
        player.setAge(request.getAge());
        player.setRole(request.getRole());
        player.setNativePlace(request.getNativePlace());
        player.setCurrentAddress(request.getCurrentAddress());
        player.setTeamRepresented(request.getTeamRepresented());
        player.setDob(request.getDob());
        player.setPhoneNumber(request.getPhoneNumber());
        player.setContactNo(request.getContactNo());
        player.setVillage(request.getVillage());
        player.setBattingStyle(request.getBattingStyle());
        player.setBowlingStyle(request.getBowlingStyle());
        player.setJerseyName(request.getJerseyName());
        player.setJerseyNumber(request.getJerseyNumber());
        player.setJerseySize(request.getJerseySize());
        player.setBasePrice(request.getBasePrice());
        log.info("Updated player: {}", player.getPlayerName());
        return playerMapper.toResponse(playerRepository.save(player));
    }

    @Transactional
    public void deletePlayer(Long id) {
        Player player = getPlayerEntity(id);
        log.info("Deleting player: {}", player.getPlayerName());
        playerRepository.delete(player);
    }

    @Transactional
    public PlayerResponse updateStatus(Long id, PlayerStatus status) {
        Player player = getPlayerEntity(id);
        player.setStatus(status);
        log.info("Updated player {} status to {}", player.getPlayerName(), status);
        return playerMapper.toResponse(playerRepository.save(player));
    }

    public Player getPlayerEntity(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player", id));
    }

    private Player buildPlayer(PlayerRequest request) {
        return Player.builder()
                .playerName(request.getPlayerName())
                .age(request.getAge())
                .role(request.getRole())
                .nativePlace(request.getNativePlace())
                .village(request.getVillage())
                .currentAddress(request.getCurrentAddress())
                .teamRepresented(request.getTeamRepresented())
                .dob(request.getDob())
                .phoneNumber(request.getPhoneNumber())
                .contactNo(request.getContactNo())
                .battingStyle(request.getBattingStyle())
                .bowlingStyle(request.getBowlingStyle())
                .jerseyName(request.getJerseyName())
                .jerseyNumber(request.getJerseyNumber())
                .jerseySize(request.getJerseySize())
                .playerImage(request.getPlayerImage())
                .basePrice(request.getBasePrice())
                .status(PlayerStatus.AVAILABLE)
                .build();
    }
}
