package com.learnhub.service;

import com.learnhub.entity.*;
import com.learnhub.enums.EnrollmentStatus;
import com.learnhub.exception.BadRequestException;
import com.learnhub.exception.ResourceNotFoundException;
import com.learnhub.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final CertificateService certificateService;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            LessonProgressRepository lessonProgressRepository,
            CertificateService certificateService) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.certificateService = certificateService;
    }

    @Transactional
    public Enrollment enrollCourse(Long courseId, User student) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new BadRequestException("You are already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment(student, course);
        Enrollment saved = enrollmentRepository.save(enrollment);

        // Pre-create lesson progresses for all lessons in this course
        if (course.getSections() != null) {
            for (Section s : course.getSections()) {
                if (s.getLessons() != null) {
                    for (Lesson l : s.getLessons()) {
                        LessonProgress lp = new LessonProgress(saved, l);
                        lessonProgressRepository.save(lp);
                    }
                }
            }
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public Page<Enrollment> getStudentEnrollments(User student, Pageable pageable) {
        return enrollmentRepository.findByStudent(student, pageable);
    }

    @Transactional
    public void recalculateProgress(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", enrollmentId));

        long totalLessons = lessonRepository.countByCourseId(enrollment.getCourse().getId());
        if (totalLessons == 0) {
            enrollment.setProgressPercentage(100.0);
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            enrollment.setCompletedAt(LocalDateTime.now());
            enrollmentRepository.save(enrollment);
            certificateService.generateCertificateIfEligible(enrollment.getStudent(), enrollment.getCourse());
            return;
        }

        long completedLessons = lessonProgressRepository.countCompletedLessonsByEnrollmentId(enrollmentId);
        double percentage = ((double) completedLessons / (double) totalLessons) * 100.0;
        double rounded = Math.round(percentage * 10.0) / 10.0;

        enrollment.setProgressPercentage(rounded);

        if (rounded >= 100.0) {
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            if (enrollment.getCompletedAt() == null) {
                enrollment.setCompletedAt(LocalDateTime.now());
            }
            // Auto issue certificate
            certificateService.generateCertificateIfEligible(enrollment.getStudent(), enrollment.getCourse());
        } else {
            enrollment.setStatus(EnrollmentStatus.ACTIVE);
        }

        enrollmentRepository.save(enrollment);
    }
}
