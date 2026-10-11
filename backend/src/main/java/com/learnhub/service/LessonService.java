package com.learnhub.service;

import com.learnhub.entity.Enrollment;
import com.learnhub.entity.Lesson;
import com.learnhub.entity.LessonProgress;
import com.learnhub.entity.User;
import com.learnhub.exception.AccessDeniedException;
import com.learnhub.exception.ResourceNotFoundException;
import com.learnhub.repository.EnrollmentRepository;
import com.learnhub.repository.LessonProgressRepository;
import com.learnhub.repository.LessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final EnrollmentService enrollmentService;

    public LessonService(
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository,
            LessonProgressRepository lessonProgressRepository,
            EnrollmentService enrollmentService) {
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.enrollmentService = enrollmentService;
    }

    @Transactional
    public LessonProgress updateLessonProgress(Long lessonId, boolean completed, Integer watchPosition, User student) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        Long courseId = lesson.getSection().getCourse().getId();

        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new AccessDeniedException("You must be enrolled in this course to track lesson progress"));

        LessonProgress progress = lessonProgressRepository.findByEnrollmentIdAndLessonId(enrollment.getId(), lesson.getId())
                .orElseGet(() -> {
                    LessonProgress newProg = new LessonProgress(enrollment, lesson);
                    return lessonProgressRepository.save(newProg);
                });

        progress.setCompleted(completed);
        if (completed && progress.getCompletedAt() == null) {
            progress.setCompletedAt(LocalDateTime.now());
        }
        if (watchPosition != null) {
            progress.setLastWatchPositionSeconds(watchPosition);
        }

        LessonProgress saved = lessonProgressRepository.save(progress);

        // Recalculate course overall progress
        enrollmentService.recalculateProgress(enrollment.getId());

        return saved;
    }
}
