package com.learnhub.controller;

import com.learnhub.dto.request.LiveClassRequest;
import com.learnhub.dto.response.ApiResponse;
import com.learnhub.dto.response.LiveClassResponse;
import com.learnhub.entity.User;
import com.learnhub.enums.LiveClassStatus;
import com.learnhub.service.AuthService;
import com.learnhub.service.LiveClassService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/live-classes")
public class LiveClassController {

    private final LiveClassService liveClassService;
    private final AuthService authService;

    public LiveClassController(LiveClassService liveClassService, AuthService authService) {
        this.liveClassService = liveClassService;
        this.authService = authService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LiveClassResponse>> createLiveClass(
            @Valid @RequestBody LiveClassRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        LiveClassResponse response = liveClassService.createLiveClass(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Live class scheduled successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LiveClassResponse>>> getUpcomingAndLiveClasses() {
        List<LiveClassResponse> response = liveClassService.getUpcomingAndLiveClasses();
        return ResponseEntity.ok(ApiResponse.success("Upcoming and live classes retrieved", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LiveClassResponse>> getLiveClassById(@PathVariable Long id) {
        LiveClassResponse response = liveClassService.getLiveClassById(id);
        return ResponseEntity.ok(ApiResponse.success("Live class details retrieved", response));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<LiveClassResponse>>> getCourseLiveClasses(@PathVariable Long courseId) {
        List<LiveClassResponse> response = liveClassService.getCourseLiveClasses(courseId);
        return ResponseEntity.ok(ApiResponse.success("Course live classes retrieved", response));
    }

    @GetMapping("/instructor/my")
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<LiveClassResponse>>> getMyLiveClasses() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<LiveClassResponse> response = liveClassService.getMyLiveClasses(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Instructor live classes retrieved", response));
    }

    @GetMapping("/student/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<LiveClassResponse>>> getStudentLiveClasses() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<LiveClassResponse> response = liveClassService.getStudentLiveClasses(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Enrolled live classes retrieved", response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LiveClassResponse>> updateLiveClassStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        LiveClassStatus status = LiveClassStatus.valueOf(body.get("status").toUpperCase());
        LiveClassResponse response = liveClassService.updateStatus(id, status, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Live class status updated to " + status, response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteLiveClass(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        liveClassService.deleteLiveClass(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Live class deleted successfully"));
    }
}
