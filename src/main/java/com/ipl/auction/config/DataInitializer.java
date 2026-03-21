package com.ipl.auction.config;

import com.ipl.auction.entity.AdminUser;
import com.ipl.auction.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!adminUserRepository.existsByUsername("admin")) {
            AdminUser admin = AdminUser.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@ipl.com")
                    .role("ROLE_ADMIN")
                    .build();
            adminUserRepository.save(admin);
            log.info("Default admin user created");
        } else {
            // Ensure password is correctly encoded
            AdminUser admin = adminUserRepository.findByUsername("admin").get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            adminUserRepository.save(admin);
            log.info("Admin password re-encoded on startup");
        }
    }
}
