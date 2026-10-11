package com.learnhub.controller;

import com.learnhub.dto.request.TransactionPayRequest;
import com.learnhub.dto.response.ApiResponse;
import com.learnhub.dto.response.TransactionResponse;
import com.learnhub.entity.User;
import com.learnhub.service.AuthService;
import com.learnhub.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final AuthService authService;

    public TransactionController(TransactionService transactionService, AuthService authService) {
        this.transactionService = transactionService;
        this.authService = authService;
    }

    @GetMapping("/config")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPaymentConfig(
            @RequestParam(required = false) Long courseId
    ) {
        Map<String, Object> config = transactionService.getPaymentConfig(courseId);
        return ResponseEntity.ok(ApiResponse.success("Payment recipient configuration", config));
    }

    @PostMapping("/pay")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TransactionResponse>> processPayment(
            @Valid @RequestBody TransactionPayRequest request
    ) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        TransactionResponse response = transactionService.processCoursePayment(request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Payment completed successfully to " + TransactionService.TARGET_PHONE_NUMBER, response));
    }

    @GetMapping("/my-history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getMyTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<TransactionResponse> transactions = transactionService.getStudentTransactions(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success("Transaction history retrieved", transactions));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<TransactionResponse> transactions = transactionService.getAllTransactions(pageable);
        return ResponseEntity.ok(ApiResponse.success("All transactions retrieved", transactions));
    }
}
