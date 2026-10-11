package com.learnhub.controller;

import com.learnhub.dto.response.ApiResponse;
import com.learnhub.dto.response.CertificateResponse;
import com.learnhub.entity.User;
import com.learnhub.service.AuthService;
import com.learnhub.service.CertificateService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;
    private final AuthService authService;

    public CertificateController(CertificateService certificateService, AuthService authService) {
        this.certificateService = certificateService;
        this.authService = authService;
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<ApiResponse<CertificateResponse>> verifyCertificate(@PathVariable String code) {
        CertificateResponse cert = certificateService.verifyCertificate(code);
        return ResponseEntity.ok(ApiResponse.success("Certificate is authentic and valid", cert));
    }

    @GetMapping("/my-certificates")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<CertificateResponse>>> getMyCertificates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("issuedAt").descending());
        Page<CertificateResponse> certificates = certificateService.getStudentCertificates(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success("Certificates retrieved successfully", certificates));
    }
}
