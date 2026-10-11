package com.learnhub.repository;

import com.learnhub.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findBySectionId(Long sectionId);

    List<Quiz> findByCourseId(Long courseId);

    Optional<Quiz> findByIdAndActiveTrue(Long id);
}
