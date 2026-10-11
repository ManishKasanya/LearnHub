package com.learnhub.repository;

import com.learnhub.entity.Course;
import com.learnhub.entity.Enrollment;
import com.learnhub.entity.User;
import com.learnhub.enums.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByStudentAndCourse(User student, Course course);

    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);

    Boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"course", "course.category", "course.instructor"})
    Page<Enrollment> findByStudent(User student, Pageable pageable);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"course", "course.category", "course.instructor"})
    Page<Enrollment> findByStudentId(Long studentId, Pageable pageable);

    List<Enrollment> findByStudentId(Long studentId);

    Page<Enrollment> findByCourse(Course course, Pageable pageable);

    Page<Enrollment> findByCourseId(Long courseId, Pageable pageable);

    List<Enrollment> findByCourseId(Long courseId);

    long countByCourseId(Long courseId);

    long countByStudentId(Long studentId);

    long countByStatus(EnrollmentStatus status);
}
