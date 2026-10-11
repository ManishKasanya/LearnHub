package com.learnhub.repository;

import com.learnhub.entity.Certificate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByCertificateCode(String certificateCode);

    Optional<Certificate> findByStudentIdAndCourseId(Long studentId, Long courseId);

    Boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    Page<Certificate> findByStudentId(Long studentId, Pageable pageable);

    long countByStudentId(Long studentId);
}
