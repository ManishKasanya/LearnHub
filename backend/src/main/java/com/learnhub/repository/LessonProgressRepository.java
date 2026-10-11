package com.learnhub.repository;

import com.learnhub.entity.Enrollment;
import com.learnhub.entity.Lesson;
import com.learnhub.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByEnrollmentAndLesson(Enrollment enrollment, Lesson lesson);

    Optional<LessonProgress> findByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);

    List<LessonProgress> findByEnrollmentId(Long enrollmentId);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.enrollment.id = :enrollmentId AND lp.completed = true")
    long countCompletedLessonsByEnrollmentId(@Param("enrollmentId") Long enrollmentId);
}
