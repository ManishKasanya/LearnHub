package com.learnhub.controller;

import com.learnhub.dto.response.ApiResponse;
import com.learnhub.dto.response.EnrollmentResponse;
import com.learnhub.entity.Enrollment;
import com.learnhub.entity.User;
import com.learnhub.service.AuthService;
import com.learnhub.service.CourseService;
import com.learnhub.service.EnrollmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final CourseService courseService;
    private final AuthService authService;

    public EnrollmentController(
            EnrollmentService enrollmentService,
            CourseService courseService,
            AuthService authService) {
        this.enrollmentService = enrollmentService;
        this.courseService = courseService;
        this.authService = authService;
    }

    @PostMapping("/courses/{courseId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enrollInCourse(@PathVariable Long courseId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Enrollment enrollment = enrollmentService.enrollCourse(courseId, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Successfully enrolled in course!", EnrollmentResponse.fromEntity(enrollment)));
    }

    @GetMapping("/my-courses")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<EnrollmentResponse>>> getMyEnrolledCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("enrolledAt").descending());
        Page<Enrollment> enrollments = enrollmentService.getStudentEnrollments(currentUser, pageable);
        Page<EnrollmentResponse> responsePage = enrollments.map(EnrollmentResponse::fromEntity);
        return ResponseEntity.ok(ApiResponse.success("Enrolled courses retrieved", responsePage));
    }
}
