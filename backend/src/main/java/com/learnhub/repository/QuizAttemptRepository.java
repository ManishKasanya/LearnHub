package com.learnhub.repository;

import com.learnhub.entity.QuizAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByStudentIdAndQuizIdOrderBySubmittedAtDesc(Long studentId, Long quizId);

    Page<QuizAttempt> findByStudentId(Long studentId, Pageable pageable);

    long countByStudentIdAndPassedTrue(Long studentId);
}
