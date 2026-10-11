package com.learnhub.service;

import com.learnhub.dto.request.CourseCreateRequest;
import java.math.BigDecimal;
import com.learnhub.dto.request.LessonRequest;
import com.learnhub.dto.request.SectionRequest;
import com.learnhub.dto.response.CourseResponse;
import com.learnhub.entity.*;
import com.learnhub.enums.CourseLevel;
import com.learnhub.enums.CourseStatus;
import com.learnhub.enums.Role;
import com.learnhub.exception.AccessDeniedException;
import com.learnhub.exception.BadRequestException;
import com.learnhub.exception.ResourceNotFoundException;
import com.learnhub.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final ReviewRepository reviewRepository;
    private final AuthService authService;

    public CourseService(
            CourseRepository courseRepository,
            CategoryRepository categoryRepository,
            SectionRepository sectionRepository,
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository,
            LessonProgressRepository lessonProgressRepository,
            ReviewRepository reviewRepository,
            AuthService authService) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.reviewRepository = reviewRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public Page<CourseResponse> searchCourses(String keyword, Long categoryId, CourseLevel level, Pageable pageable) {
        Page<Course> coursePage = courseRepository.searchCourses(
                CourseStatus.PUBLISHED,
                categoryId,
                level,
                (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null,
                pageable
        );

        User currentUser = authService.getCurrentAuthenticatedUser();
        List<CourseResponse> dtos = coursePage.getContent().stream()
                .map(course -> mapToCourseResponse(course, currentUser, false))
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, coursePage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        User currentUser = authService.getCurrentAuthenticatedUser();
        return mapToCourseResponse(course, currentUser, true);
    }

    @Transactional
    public CourseResponse createCourse(CourseCreateRequest request, User instructor) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setSubtitle(request.getSubtitle());
        course.setDescription(request.getDescription());
        course.setInstructor(instructor);
        course.setCategory(category);
        course.setPrice(request.getPrice());
        course.setLevel(request.getLevel() != null ? request.getLevel() : CourseLevel.BEGINNER);
        course.setStatus(CourseStatus.PENDING_APPROVAL); // Require admin approval or set PUBLISHED if admin
        if (instructor.getRole() == Role.ROLE_ADMIN) {
            course.setStatus(CourseStatus.PUBLISHED);
        }
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setPromoVideoUrl(request.getPromoVideoUrl());
        course.setLanguage(request.getLanguage() != null ? request.getLanguage() : "English");

        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved, instructor, true);
    }

    @Transactional
    public CourseResponse updateCourse(Long courseId, CourseCreateRequest request, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("You do not have permission to update this course");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        course.setTitle(request.getTitle());
        course.setSubtitle(request.getSubtitle());
        course.setDescription(request.getDescription());
        course.setCategory(category);
        course.setPrice(request.getPrice());
        course.setLevel(request.getLevel());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setPromoVideoUrl(request.getPromoVideoUrl());
        course.setLanguage(request.getLanguage());

        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved, user, true);
    }

    @Transactional
    public CourseResponse updateCoursePrice(Long courseId, BigDecimal newPrice, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("You do not have permission to update this course price");
        }

        if (newPrice == null || newPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Course price must be 0 or greater");
        }

        course.setPrice(newPrice);
        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved, user, true);
    }

    @Transactional
    public void deleteCourse(Long courseId, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("You do not have permission to delete this course");
        }

        courseRepository.delete(course);
    }

    @Transactional
    public Section addSection(Long courseId, SectionRequest request, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("You do not have permission to modify this course");
        }

        Section section = new Section(course, request.getTitle(), request.getOrderIndex());
        return sectionRepository.save(section);
    }

    @Transactional
    public Lesson addLesson(Long sectionId, LessonRequest request, User user) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section", "id", sectionId));

        Course course = section.getCourse();
        if (!course.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("You do not have permission to modify this section");
        }

        Lesson lesson = new Lesson();
        lesson.setSection(section);
        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setDurationSeconds(request.getDurationSeconds());
        lesson.setOrderIndex(request.getOrderIndex());
        lesson.setFreePreview(request.isFreePreview());
        lesson.setLessonType(request.getLessonType());
        lesson.setAttachmentUrl(request.getAttachmentUrl());

        Lesson saved = lessonRepository.save(lesson);

        // Update total course duration
        course.setTotalDurationSeconds(course.getTotalDurationSeconds() + (lesson.getDurationSeconds() != null ? lesson.getDurationSeconds() : 0));
        courseRepository.save(course);

        return saved;
    }

    @Transactional
    public CourseResponse updateCourseStatus(Long courseId, CourseStatus status, String reason, User admin) {
        if (admin.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Only administrators can approve or reject courses");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        course.setStatus(status);
        if (reason != null) {
            course.setRejectionReason(reason);
        }

        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved, admin, true);
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getInstructorCourses(User instructor) {
        return courseRepository.findByInstructor(instructor).stream()
                .map(c -> mapToCourseResponse(c, instructor, true))
                .collect(Collectors.toList());
    }

    public CourseResponse mapToCourseResponse(Course course, User currentUser, boolean includeCurriculum) {
        CourseResponse dto = new CourseResponse();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setSubtitle(course.getSubtitle());
        dto.setDescription(course.getDescription());
        if (course.getInstructor() != null) {
            dto.setInstructorId(course.getInstructor().getId());
            dto.setInstructorName(course.getInstructor().getFullName());
            dto.setInstructorHeadline(course.getInstructor().getHeadline());
            dto.setInstructorAvatarUrl(course.getInstructor().getAvatarUrl());
        }
        if (course.getCategory() != null) {
            dto.setCategoryId(course.getCategory().getId());
            dto.setCategoryName(course.getCategory().getName());
            dto.setCategorySlug(course.getCategory().getSlug());
        }
        dto.setPrice(course.getPrice());
        dto.setLevel(course.getLevel());
        dto.setStatus(course.getStatus());
        dto.setThumbnailUrl(course.getThumbnailUrl());
        dto.setPromoVideoUrl(course.getPromoVideoUrl());
        dto.setLanguage(course.getLanguage());
        dto.setTotalDurationSeconds(course.getTotalDurationSeconds());
        dto.setCreatedAt(course.getCreatedAt());

        Double avgRating = reviewRepository.getAverageRatingForCourse(course.getId());
        dto.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 5.0);
        dto.setReviewsCount(reviewRepository.countByCourseId(course.getId()));
        dto.setEnrolledStudentsCount(enrollmentRepository.countByCourseId(course.getId()));

        Enrollment enrollment = null;
        if (currentUser != null) {
            enrollment = enrollmentRepository.findByStudentIdAndCourseId(currentUser.getId(), course.getId()).orElse(null);
            dto.setEnrolled(enrollment != null);
            if (enrollment != null) {
                dto.setStudentProgressPercentage(enrollment.getProgressPercentage());
            }
        }

        List<Section> sections = course.getSections();
        dto.setTotalSectionsCount(sections != null ? sections.size() : 0);

        int totalLessons = 0;
        if (sections != null) {
            for (Section s : sections) {
                if (s.getLessons() != null) totalLessons += s.getLessons().size();
            }
        }
        dto.setTotalLessonsCount(totalLessons);

        if (includeCurriculum && sections != null) {
            final Enrollment finalEnrollment = enrollment;
            List<CourseResponse.SectionDto> sectionDtos = new ArrayList<>();

            for (Section sec : sections) {
                CourseResponse.SectionDto sDto = new CourseResponse.SectionDto();
                sDto.setId(sec.getId());
                sDto.setTitle(sec.getTitle());
                sDto.setOrderIndex(sec.getOrderIndex());

                List<CourseResponse.LessonDto> lessonDtos = new ArrayList<>();
                if (sec.getLessons() != null) {
                    for (Lesson les : sec.getLessons()) {
                        CourseResponse.LessonDto lDto = new CourseResponse.LessonDto();
                        lDto.setId(les.getId());
                        lDto.setTitle(les.getTitle());
                        lDto.setDurationSeconds(les.getDurationSeconds());
                        lDto.setOrderIndex(les.getOrderIndex());
                        lDto.setFreePreview(les.isFreePreview());
                        lDto.setLessonType(les.getLessonType().name());

                        // Content is only visible if enrolled, preview, or instructor/admin
                        boolean hasAccess = (currentUser != null && (course.getInstructor().getId().equals(currentUser.getId()) || currentUser.getRole() == Role.ROLE_ADMIN))
                                || finalEnrollment != null
                                || les.isFreePreview();

                        if (hasAccess) {
                            lDto.setContent(les.getContent());
                            lDto.setVideoUrl(les.getVideoUrl());
                            lDto.setAttachmentUrl(les.getAttachmentUrl());
                        }

                        if (finalEnrollment != null) {
                            lessonProgressRepository.findByEnrollmentIdAndLessonId(finalEnrollment.getId(), les.getId())
                                    .ifPresent(progress -> {
                                        lDto.setCompleted(progress.isCompleted());
                                        lDto.setLastWatchPositionSeconds(progress.getLastWatchPositionSeconds());
                                    });
                        }

                        lessonDtos.add(lDto);
                    }
                }
                sDto.setLessons(lessonDtos);

                List<CourseResponse.QuizDto> quizDtos = new ArrayList<>();
                if (sec.getQuizzes() != null) {
                    for (Quiz q : sec.getQuizzes()) {
                        CourseResponse.QuizDto qDto = new CourseResponse.QuizDto();
                        qDto.setId(q.getId());
                        qDto.setTitle(q.getTitle());
                        qDto.setDescription(q.getDescription());
                        qDto.setPassingScore(q.getPassingScore());
                        qDto.setTimeLimitMinutes(q.getTimeLimitMinutes());
                        qDto.setQuestionCount(q.getQuestions() != null ? q.getQuestions().size() : 0);
                        quizDtos.add(qDto);
                    }
                }
                sDto.setQuizzes(quizDtos);

                sectionDtos.add(sDto);
            }
            dto.setSections(sectionDtos);
        }

        return dto;
    }
}
