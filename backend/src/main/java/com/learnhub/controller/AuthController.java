package com.learnhub.controller;

import com.learnhub.dto.request.LoginRequest;
import com.learnhub.dto.request.RegisterRequest;
import com.learnhub.dto.response.ApiResponse;
import com.learnhub.dto.response.AuthResponse;
import com.learnhub.entity.User;
import com.learnhub.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("Account registered successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Not authenticated"));
        }
        return ResponseEntity.ok(ApiResponse.success("Current user profile retrieved", user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody com.learnhub.dto.request.ProfileUpdateRequest profileUpdateRequest) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Not authenticated"));
        }
        User updated = authService.updateProfile(currentUser, profileUpdateRequest);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
