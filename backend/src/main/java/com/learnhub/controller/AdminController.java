package com.learnhub.controller;

import com.learnhub.dto.response.ApiResponse;
import com.learnhub.dto.response.CourseResponse;
import com.learnhub.dto.response.DashboardStatsResponse;
import com.learnhub.entity.Category;
import com.learnhub.entity.Course;
import com.learnhub.entity.User;
import com.learnhub.enums.Role;
import com.learnhub.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final JdbcTemplate jdbcTemplate;

    public AdminController(AdminService adminService, JdbcTemplate jdbcTemplate) {
        this.adminService = adminService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        DashboardStatsResponse stats = adminService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.success("Platform statistics retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = adminService.getAllUsers(role, pageable);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(@PathVariable Long id) {
        User user = adminService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User active status updated", user));
    }

    @GetMapping("/courses/pending")
    public ResponseEntity<ApiResponse<Page<CourseResponse>>> getPendingCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CourseResponse> courses = adminService.getPendingCourses(pageable);
        return ResponseEntity.ok(ApiResponse.success("Pending courses retrieved", courses));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody Category category) {
        Category saved = adminService.createCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Category created successfully", saved));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully"));
    }

    @PostMapping("/database/query")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeDatabaseQuery(@RequestBody Map<String, String> request) {
        String sql = request.get("query");
        if (sql == null || sql.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("SQL query is required"));
        }
        try {
            String trimmed = sql.trim();
            String upper = trimmed.toUpperCase();
            if (upper.startsWith("SELECT") || upper.startsWith("SHOW") || upper.startsWith("DESCRIBE") || upper.startsWith("EXPLAIN")) {
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(trimmed);
                List<String> columns = rows.isEmpty() ? Collections.emptyList() : new ArrayList<>(rows.get(0).keySet());
                Map<String, Object> result = new HashMap<>();
                result.put("columns", columns);
                result.put("rows", rows);
                result.put("rowCount", rows.size());
                return ResponseEntity.ok(ApiResponse.success("Query executed successfully", result));
            } else {
                int affectedRows = jdbcTemplate.update(trimmed);
                Map<String, Object> result = new HashMap<>();
                result.put("affectedRows", affectedRows);
                return ResponseEntity.ok(ApiResponse.success("Statement executed successfully. Affected rows: " + affectedRows, result));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("SQL Execution Error: " + e.getMessage()));
        }
    }
}
