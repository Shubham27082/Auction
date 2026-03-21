package com.ipl.auction.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Component
@Slf4j
public class FileStorageUtil {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final java.util.Set<String> ALLOWED_TYPES =
            java.util.Set.of("image/jpeg", "image/png", "image/gif", "image/webp");

    public String storeFile(MultipartFile file, String subDir) throws IOException {
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);
        String filename = UUID.randomUUID() + "." + extension;

        Path targetDir = Paths.get(uploadDir, subDir);
        Files.createDirectories(targetDir);

        Path targetPath = targetDir.resolve(filename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        log.info("Stored file: {}/{}", subDir, filename);
        return subDir + "/" + filename;
    }

    public void deleteFile(String filePath) {
        if (filePath == null) return;
        try {
            Path path = Paths.get(uploadDir, filePath);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("Could not delete file: {}", filePath);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("File type not allowed. Allowed: JPEG, PNG, GIF, WEBP");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
