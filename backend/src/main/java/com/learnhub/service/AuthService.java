package com.learnhub.service;

import com.learnhub.dto.request.LoginRequest;
import com.learnhub.dto.request.RegisterRequest;
import com.learnhub.dto.response.AuthResponse;
import com.learnhub.entity.User;
import com.learnhub.exception.BadRequestException;
import com.learnhub.repository.UserRepository;
import com.learnhub.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAvatarUrl()
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : com.learnhub.enums.Role.ROLE_STUDENT);
        user.setHeadline(registerRequest.getHeadline());
        user.setBio(registerRequest.getBio());
        user.setActive(true);

        User savedUser = userRepository.save(user);

        String jwt = tokenProvider.generateTokenForUser(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name()
        );

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getAvatarUrl()
        );
    }

    @Transactional(readOnly = true)
    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
    @Transactional
    public User updateProfile(User currentUser, com.learnhub.dto.request.ProfileUpdateRequest req) {
        if (currentUser == null) {
            throw new BadRequestException("User not authenticated");
        }
        if (req.getFullName() != null && !req.getFullName().trim().isEmpty()) {
            currentUser.setFullName(req.getFullName().trim());
        }
        if (req.getHeadline() != null) {
            currentUser.setHeadline(req.getHeadline().trim());
        }
        if (req.getBio() != null) {
            currentUser.setBio(req.getBio().trim());
        }
        if (req.getAvatarUrl() != null) {
            currentUser.setAvatarUrl(req.getAvatarUrl().trim());
        }
        return userRepository.save(currentUser);
    }
}
