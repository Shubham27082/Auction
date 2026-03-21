package com.ipl.auction.service;

import com.ipl.auction.dto.request.LoginRequest;
import com.ipl.auction.dto.response.AuthResponse;
import com.ipl.auction.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtils.generateToken(userDetails);
        String role = userDetails.getAuthorities().stream()
                .findFirst().map(a -> a.getAuthority()).orElse("ROLE_ADMIN");

        log.info("Admin '{}' logged in successfully", userDetails.getUsername());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .username(userDetails.getUsername())
                .role(role)
                .build();
    }
}
