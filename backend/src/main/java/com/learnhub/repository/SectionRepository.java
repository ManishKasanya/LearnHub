package com.learnhub.repository;

import com.learnhub.entity.Course;
import com.learnhub.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {

    List<Section> findByCourseOrderByOrderIndexAsc(Course course);

    List<Section> findByCourseIdOrderByOrderIndexAsc(Long courseId);
}
