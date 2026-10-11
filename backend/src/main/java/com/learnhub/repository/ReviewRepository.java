package com.learnhub.repository;

import com.learnhub.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByCourseId(Long courseId, Pageable pageable);

    Optional<Review> findByStudentIdAndCourseId(Long studentId, Long courseId);

    Boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.course.id = :courseId")
    Double getAverageRatingForCourse(@Param("courseId") Long courseId);

    long countByCourseId(Long courseId);
}
