package com.learnhub.repository;

import com.learnhub.entity.Category;
import com.learnhub.entity.Course;
import com.learnhub.entity.User;
import com.learnhub.enums.CourseLevel;
import com.learnhub.enums.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    List<Course> findByInstructor(User instructor);

    Page<Course> findByInstructor(User instructor, Pageable pageable);

    Page<Course> findByCategoryAndStatus(Category category, CourseStatus status, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.status = :status AND " +
            "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
            "(:level IS NULL OR c.level = :level) AND " +
            "(:keyword IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Course> searchCourses(
            @Param("status") CourseStatus status,
            @Param("categoryId") Long categoryId,
            @Param("level") CourseLevel level,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(CourseStatus status);

    long countByInstructor(User instructor);
}
