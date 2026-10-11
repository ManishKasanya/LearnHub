package com.learnhub.repository;

import com.learnhub.entity.Lesson;
import com.learnhub.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findBySectionOrderByOrderIndexAsc(Section section);

    List<Lesson> findBySectionIdOrderByOrderIndexAsc(Long sectionId);

    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.section.course.id = :courseId")
    long countByCourseId(@Param("courseId") Long courseId);
}
