package com.learnhub.controller;

import com.learnhub.dto.response.ApiResponse;
import com.learnhub.repository.CategoryRepository;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.EnrollmentRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final EnrollmentRepository enrollmentRepository;

    public HealthController(
            UserRepository userRepository,
            CourseRepository courseRepository,
            CategoryRepository categoryRepository,
            EnrollmentRepository enrollmentRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("status", "UP");
        stats.put("platform", "LearnHub Online Learning Platform");
        stats.put("version", "1.0.0");
        stats.put("javaVersion", System.getProperty("java.version"));
        stats.put("usersCount", userRepository.count());
        stats.put("categoriesCount", categoryRepository.count());
        stats.put("coursesCount", courseRepository.count());
        stats.put("enrollmentsCount", enrollmentRepository.count());

        return ResponseEntity.ok(ApiResponse.success("LearnHub Backend API is healthy and connected to MySQL", stats));
    }

    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<String>> ping() {
        return ResponseEntity.ok(ApiResponse.success("pong"));
    }
}
