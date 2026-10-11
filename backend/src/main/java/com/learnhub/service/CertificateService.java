package com.learnhub.service;

import com.learnhub.dto.response.CertificateResponse;
import com.learnhub.entity.Certificate;
import com.learnhub.entity.Course;
import com.learnhub.entity.User;
import com.learnhub.exception.ResourceNotFoundException;
import com.learnhub.repository.CertificateRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;

    public CertificateService(CertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    @Transactional
    public Certificate generateCertificateIfEligible(User student, Course course) {
        return certificateRepository.findByStudentIdAndCourseId(student.getId(), course.getId())
                .orElseGet(() -> {
                    String uniqueCode = "LH-" + course.getId() + "-" + student.getId() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                    Certificate certificate = new Certificate(uniqueCode, student, course);
                    certificate.setIssuedAt(LocalDateTime.now());
                    return certificateRepository.save(certificate);
                });
    }

    @Transactional(readOnly = true)
    public CertificateResponse verifyCertificate(String certificateCode) {
        Certificate certificate = certificateRepository.findByCertificateCode(certificateCode.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with verification code: " + certificateCode));

        return new CertificateResponse(
                certificate.getId(),
                certificate.getCertificateCode(),
                certificate.getStudent().getId(),
                certificate.getStudent().getFullName(),
                certificate.getStudent().getEmail(),
                certificate.getCourse().getId(),
                certificate.getCourse().getTitle(),
                certificate.getCourse().getInstructor().getFullName(),
                certificate.getIssuedAt(),
                certificate.getPdfUrl()
        );
    }

    @Transactional(readOnly = true)
    public Page<CertificateResponse> getStudentCertificates(User student, Pageable pageable) {
        return certificateRepository.findByStudentId(student.getId(), pageable)
                .map(cert -> new CertificateResponse(
                        cert.getId(),
                        cert.getCertificateCode(),
                        cert.getStudent().getId(),
                        cert.getStudent().getFullName(),
                        cert.getStudent().getEmail(),
                        cert.getCourse().getId(),
                        cert.getCourse().getTitle(),
                        cert.getCourse().getInstructor().getFullName(),
                        cert.getIssuedAt(),
                        cert.getPdfUrl()
                ));
    }
}
