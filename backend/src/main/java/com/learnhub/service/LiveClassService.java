package com.learnhub.service;

import com.learnhub.dto.request.LiveClassRequest;
import com.learnhub.dto.response.LiveClassResponse;
import com.learnhub.entity.Course;
import com.learnhub.entity.Enrollment;
import com.learnhub.entity.LiveClass;
import com.learnhub.entity.User;
import com.learnhub.enums.LiveClassStatus;
import com.learnhub.enums.Role;
import com.learnhub.exception.AccessDeniedException;
import com.learnhub.exception.BadRequestException;
import com.learnhub.exception.ResourceNotFoundException;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.EnrollmentRepository;
import com.learnhub.repository.LiveClassRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LiveClassService {

    private final LiveClassRepository liveClassRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public LiveClassService(
            LiveClassRepository liveClassRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository) {
        this.liveClassRepository = liveClassRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional
    public LiveClassResponse createLiveClass(LiveClassRequest request, User instructor) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        if (!course.getInstructor().getId().equals(instructor.getId()) && instructor.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("You can only schedule live classes for your own courses");
        }

        String meetingUrl = request.getMeetingUrl();
        String platform = request.getMeetingPlatform();
        if (platform == null || platform.isBlank()) {
            platform = "JITSI";
        }

        // If no meeting URL provided or JITSI selected, auto-generate high-quality in-app room URL
        if (meetingUrl == null || meetingUrl.isBlank() || "JITSI".equalsIgnoreCase(platform)) {
            String roomSlug = "learnhub-live-" + course.getId() + "-" + UUID.randomUUID().toString().substring(0, 8);
            meetingUrl = "https://meet.jit.si/" + roomSlug;
            platform = "JITSI";
        }

        LiveClass liveClass = new LiveClass();
        liveClass.setTitle(request.getTitle());
        liveClass.setDescription(request.getDescription());
        liveClass.setCourse(course);
        liveClass.setInstructor(instructor);
        liveClass.setMeetingUrl(meetingUrl);
        liveClass.setMeetingPlatform(platform);
        liveClass.setScheduledStartTime(request.getScheduledStartTime());
        liveClass.setDurationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 60);
        liveClass.setStatus(LiveClassStatus.SCHEDULED);

        LiveClass saved = liveClassRepository.save(liveClass);
        return mapToLiveClassResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<LiveClassResponse> getMyLiveClasses(User instructor) {
        return liveClassRepository.findByInstructorIdOrderByScheduledStartTimeDesc(instructor.getId())
                .stream()
                .map(this::mapToLiveClassResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LiveClassResponse> getUpcomingAndLiveClasses() {
        return liveClassRepository.findByStatusInOrderByScheduledStartTimeAsc(
                Arrays.asList(LiveClassStatus.LIVE, LiveClassStatus.SCHEDULED)
        ).stream().map(this::mapToLiveClassResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LiveClassResponse> getCourseLiveClasses(Long courseId) {
        return liveClassRepository.findByCourseIdOrderByScheduledStartTimeDesc(courseId)
                .stream()
                .map(this::mapToLiveClassResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LiveClassResponse> getStudentLiveClasses(User student) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        if (enrollments.isEmpty()) {
            return new ArrayList<>();
        }
        List<Long> courseIds = enrollments.stream().map(e -> e.getCourse().getId()).collect(Collectors.toList());
        return liveClassRepository.findByCourseIdInOrderByScheduledStartTimeDesc(courseIds)
                .stream()
                .map(this::mapToLiveClassResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LiveClassResponse getLiveClassById(Long id) {
        LiveClass liveClass = liveClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", id));
        return mapToLiveClassResponse(liveClass);
    }

    @Transactional
    public LiveClassResponse updateStatus(Long id, LiveClassStatus status, User user) {
        LiveClass liveClass = liveClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", id));

        if (!liveClass.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("You do not have permission to manage this live class");
        }

        liveClass.setStatus(status);
        LiveClass saved = liveClassRepository.save(liveClass);
        return mapToLiveClassResponse(saved);
    }

    @Transactional
    public void deleteLiveClass(Long id, User user) {
        LiveClass liveClass = liveClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", id));

        if (!liveClass.getInstructor().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("You do not have permission to delete this live class");
        }

        liveClassRepository.delete(liveClass);
    }

    private LiveClassResponse mapToLiveClassResponse(LiveClass lc) {
        LiveClassResponse dto = new LiveClassResponse();
        dto.setId(lc.getId());
        dto.setTitle(lc.getTitle());
        dto.setDescription(lc.getDescription());
        dto.setMeetingUrl(lc.getMeetingUrl());
        dto.setMeetingPlatform(lc.getMeetingPlatform());
        dto.setScheduledStartTime(lc.getScheduledStartTime());
        dto.setDurationMinutes(lc.getDurationMinutes());
        dto.setStatus(lc.getStatus());
        dto.setRecordingUrl(lc.getRecordingUrl());
        dto.setCreatedAt(lc.getCreatedAt());
        dto.setLiveNow(lc.getStatus() == LiveClassStatus.LIVE);

        if (lc.getCourse() != null) {
            dto.setCourseId(lc.getCourse().getId());
            dto.setCourseTitle(lc.getCourse().getTitle());
            dto.setCourseThumbnailUrl(lc.getCourse().getThumbnailUrl());
        }

        if (lc.getInstructor() != null) {
            dto.setInstructorId(lc.getInstructor().getId());
            dto.setInstructorName(lc.getInstructor().getFullName());
            dto.setInstructorHeadline(lc.getInstructor().getHeadline());
            dto.setInstructorAvatarUrl(lc.getInstructor().getAvatarUrl());
        }

        return dto;
    }
}
