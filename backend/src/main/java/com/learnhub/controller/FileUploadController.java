package com.learnhub.controller;

import com.learnhub.dto.response.ApiResponse;
import com.learnhub.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${learnhub.app.uploadDir:./uploads}")
    private String uploadDir;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "thumbnails") String folder
    ) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        // Clean folder name to prevent path traversal
        String sanitizedFolder = folder.replaceAll("[^a-zA-Z0-9_-]", "");
        if (sanitizedFolder.isEmpty()) {
            sanitizedFolder = "thumbnails";
        }

        try {
            String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            String extension = "";
            int extIndex = originalFilename.lastIndexOf('.');
            if (extIndex > 0) {
                extension = originalFilename.substring(extIndex);
            }

            String uniqueFilename = UUID.randomUUID().toString() + extension;

            Path targetDirectory = Paths.get(uploadDir, sanitizedFolder).toAbsolutePath().normalize();
            if (!Files.exists(targetDirectory)) {
                Files.createDirectories(targetDirectory);
            }

            Path targetPath = targetDirectory.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + sanitizedFolder + "/" + uniqueFilename;

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", originalFilename);
            response.put("size", String.valueOf(file.getSize()));

            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));

        } catch (IOException ex) {
            throw new BadRequestException("Could not store file: " + ex.getMessage());
        }
    }
}
