package com.learnhub.repository;

import com.learnhub.entity.Course;
import com.learnhub.entity.Transaction;
import com.learnhub.entity.User;
import com.learnhub.enums.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByStudentOrderByCreatedAtDesc(User student, Pageable pageable);

    List<Transaction> findByStudentOrderByCreatedAtDesc(User student);

    Optional<Transaction> findByTransactionCode(String transactionCode);

    boolean existsByStudentIdAndCourseIdAndStatus(Long studentId, Long courseId, TransactionStatus status);

    Page<Transaction> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(TransactionStatus status);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.status = :status")
    BigDecimal sumTotalRevenueByStatus(TransactionStatus status);
}
