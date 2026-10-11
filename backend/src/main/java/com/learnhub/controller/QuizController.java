package com.learnhub.controller;

import com.learnhub.dto.request.QuizSubmitRequest;
import com.learnhub.dto.response.ApiResponse;
import com.learnhub.dto.response.QuizResultResponse;
import com.learnhub.entity.Quiz;
import com.learnhub.entity.QuizAttempt;
import com.learnhub.entity.User;
import com.learnhub.service.AuthService;
import com.learnhub.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final AuthService authService;

    public QuizController(QuizService quizService, AuthService authService) {
        this.quizService = quizService;
        this.authService = authService;
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Quiz>> getQuiz(@PathVariable Long id) {
        Quiz quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(ApiResponse.success("Quiz retrieved successfully", quiz));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<QuizResultResponse>> submitQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizSubmitRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        QuizResultResponse result = quizService.submitQuiz(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Quiz evaluated successfully", result));
    }

    @GetMapping("/{id}/attempts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<QuizAttempt>>> getMyAttempts(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<QuizAttempt> attempts = quizService.getStudentAttemptsForQuiz(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Quiz attempts retrieved", attempts));
    }
}
