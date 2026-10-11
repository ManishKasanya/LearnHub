package com.learnhub.controller;

import com.learnhub.dto.request.ReviewRequest;
import com.learnhub.dto.response.ApiResponse;
import com.learnhub.entity.Course;
import com.learnhub.entity.Review;
import com.learnhub.entity.User;
import com.learnhub.exception.BadRequestException;
import com.learnhub.exception.ResourceNotFoundException;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.EnrollmentRepository;
import com.learnhub.repository.ReviewRepository;
import com.learnhub.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AuthService authService;

    public ReviewController(
            ReviewRepository reviewRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            AuthService authService) {
        this.reviewRepository = reviewRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.authService = authService;
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<ApiResponse<Page<Review>>> getCourseReviews(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviews = reviewRepository.findByCourseId(courseId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Course reviews retrieved", reviews));
    }

    @PostMapping("/courses/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Review>> addReview(
            @PathVariable Long courseId,
            @Valid @RequestBody ReviewRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!enrollmentRepository.existsByStudentIdAndCourseId(currentUser.getId(), courseId)) {
            throw new BadRequestException("You must be enrolled in this course to leave a review");
        }

        Review review = reviewRepository.findByStudentIdAndCourseId(currentUser.getId(), courseId)
                .orElseGet(() -> new Review(currentUser, course, request.getRating(), request.getComment()));

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(ApiResponse.success("Review posted successfully", saved));
    }
}
