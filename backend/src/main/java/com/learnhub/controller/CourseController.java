package com.learnhub.controller;

import com.learnhub.dto.request.CourseCreateRequest;
import com.learnhub.dto.request.LessonRequest;
import com.learnhub.dto.request.SectionRequest;
import com.learnhub.dto.response.ApiResponse;
import com.learnhub.dto.response.CourseResponse;
import com.learnhub.entity.Lesson;
import com.learnhub.entity.Section;
import com.learnhub.entity.User;
import com.learnhub.enums.CourseLevel;
import com.learnhub.enums.CourseStatus;
import com.learnhub.service.AuthService;
import com.learnhub.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import com.learnhub.exception.BadRequestException;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final AuthService authService;

    public CourseController(CourseService courseService, AuthService authService) {
        this.courseService = courseService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CourseResponse>>> searchCourses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) CourseLevel level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<CourseResponse> response = courseService.searchCourses(keyword, categoryId, level, pageable);
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourseById(@PathVariable Long id) {
        CourseResponse response = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success("Course details retrieved", response));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(@Valid @RequestBody CourseCreateRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        CourseResponse response = courseService.createCourse(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully and submitted for review", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseCreateRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        CourseResponse response = courseService.updateCourse(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", response));
    }

    @PatchMapping("/{id}/price")
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCoursePrice(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        BigDecimal price;
        try {
            price = new BigDecimal(body.get("price").toString());
        } catch (Exception e) {
            throw new BadRequestException("Invalid price value");
        }
        CourseResponse response = courseService.updateCoursePrice(id, price, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Course price updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        courseService.deleteCourse(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully"));
    }

    @GetMapping("/instructor/my-courses")
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getMyInstructorCourses() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<CourseResponse> courses = courseService.getInstructorCourses(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Instructor courses retrieved", courses));
    }

    @PostMapping("/{id}/sections")
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Section>> addSection(
            @PathVariable Long id,
            @Valid @RequestBody SectionRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Section section = courseService.addSection(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Section added successfully", section));
    }

    @PostMapping("/sections/{sectionId}/lessons")
    @PreAuthorize("hasAnyAuthority('ROLE_INSTRUCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Lesson>> addLesson(
            @PathVariable Long sectionId,
            @Valid @RequestBody LessonRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Lesson lesson = courseService.addLesson(sectionId, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Lesson added successfully", lesson));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourseStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User admin = authService.getCurrentAuthenticatedUser();
        CourseStatus status = CourseStatus.valueOf(body.get("status"));
        String reason = body.get("reason");

        CourseResponse response = courseService.updateCourseStatus(id, status, reason, admin);
        return ResponseEntity.ok(ApiResponse.success("Course status updated to " + status, response));
    }
}
