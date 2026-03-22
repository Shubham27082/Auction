package com.ipl.auction.controller;

import com.ipl.auction.dto.request.PlayerRequest;
import com.ipl.auction.dto.response.ApiResponse;
import com.ipl.auction.dto.response.PlayerResponse;
import com.ipl.auction.entity.enums.PlayerStatus;
import com.ipl.auction.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping
    public ResponseEntity<ApiResponse<PlayerResponse>> createPlayer(@Valid @RequestBody PlayerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Player created", playerService.createPlayer(request)));
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<ApiResponse<PlayerResponse>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ApiResponse.success("Image uploaded", playerService.uploadPlayerImage(id, file)));
    }

    @PostMapping("/import/excel")
    public ResponseEntity<ApiResponse<List<PlayerResponse>>> importFromExcel(
            @RequestParam("file") MultipartFile file) throws IOException {
        List<PlayerResponse> players = playerService.importFromExcel(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Imported " + players.size() + " players", players));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlayerResponse>>> getAllPlayers(
            @RequestParam(required = false) PlayerStatus status) {
        List<PlayerResponse> players = status != null
                ? playerService.getPlayersByStatus(status)
                : playerService.getAllPlayers();
        return ResponseEntity.ok(ApiResponse.success(players));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerResponse>> getPlayerById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(playerService.getPlayerById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerResponse>> updatePlayer(
            @PathVariable Long id,
            @Valid @RequestBody PlayerRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Player updated", playerService.updatePlayer(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.ok(ApiResponse.success("Player deleted", null));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PlayerResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam PlayerStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", playerService.updateStatus(id, status)));
    }
}
