package com.learnhub.controller;

import com.learnhub.dto.response.ApiResponse;
import com.learnhub.entity.LessonProgress;
import com.learnhub.entity.User;
import com.learnhub.service.AuthService;
import com.learnhub.service.LessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;
    private final AuthService authService;

    public LessonController(LessonService lessonService, AuthService authService) {
        this.lessonService = lessonService;
        this.authService = authService;
    }

    @PostMapping("/{id}/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<LessonProgress>> updateLessonProgress(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        boolean completed = payload.get("completed") != null && Boolean.parseBoolean(payload.get("completed").toString());
        Integer watchPosition = payload.get("watchPosition") != null ? Integer.parseInt(payload.get("watchPosition").toString()) : null;

        LessonProgress progress = lessonService.updateLessonProgress(id, completed, watchPosition, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lesson progress updated successfully", progress));
    }
}
