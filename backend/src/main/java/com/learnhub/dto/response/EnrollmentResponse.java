package com.learnhub.dto.response;

import com.learnhub.entity.Course;
import com.learnhub.entity.Enrollment;
import com.learnhub.enums.EnrollmentStatus;

import java.time.LocalDateTime;

public class EnrollmentResponse {

    private Long id;
    private EnrollmentStatus status;
    private Double progressPercentage;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
    private CourseSummary course;

    public static class CourseSummary {
        private Long id;
        private String title;
        private String subtitle;
        private String categoryName;
        private String thumbnailUrl;
        private Long totalDurationSeconds;
        private Integer totalLessonsCount;
        private String instructorName;

        public CourseSummary() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getSubtitle() {
            return subtitle;
        }

        public void setSubtitle(String subtitle) {
            this.subtitle = subtitle;
        }

        public String getCategoryName() {
            return categoryName;
        }

        public void setCategoryName(String categoryName) {
            this.categoryName = categoryName;
        }

        public String getThumbnailUrl() {
            return thumbnailUrl;
        }

        public void setThumbnailUrl(String thumbnailUrl) {
            this.thumbnailUrl = thumbnailUrl;
        }

        public Long getTotalDurationSeconds() {
            return totalDurationSeconds;
        }

        public void setTotalDurationSeconds(Long totalDurationSeconds) {
            this.totalDurationSeconds = totalDurationSeconds;
        }

        public Integer getTotalLessonsCount() {
            return totalLessonsCount;
        }

        public void setTotalLessonsCount(Integer totalLessonsCount) {
            this.totalLessonsCount = totalLessonsCount;
        }

        public String getInstructorName() {
            return instructorName;
        }

        public void setInstructorName(String instructorName) {
            this.instructorName = instructorName;
        }
    }

    public static EnrollmentResponse fromEntity(Enrollment enrollment) {
        if (enrollment == null) return null;

        EnrollmentResponse resp = new EnrollmentResponse();
        resp.setId(enrollment.getId());
        resp.setStatus(enrollment.getStatus());
        resp.setProgressPercentage(enrollment.getProgressPercentage());
        resp.setEnrolledAt(enrollment.getEnrolledAt());
        resp.setCompletedAt(enrollment.getCompletedAt());

        Course c = enrollment.getCourse();
        if (c != null) {
            CourseSummary summary = new CourseSummary();
            summary.setId(c.getId());
            summary.setTitle(c.getTitle());
            summary.setSubtitle(c.getSubtitle());
            summary.setThumbnailUrl(c.getThumbnailUrl());
            summary.setTotalDurationSeconds(c.getTotalDurationSeconds());
            if (c.getCategory() != null) {
                summary.setCategoryName(c.getCategory().getName());
            }
            if (c.getInstructor() != null) {
                summary.setInstructorName(c.getInstructor().getFullName());
            }
            // Count lessons across sections
            if (c.getSections() != null) {
                int totalLessons = c.getSections().stream()
                        .mapToInt(s -> s.getLessons() != null ? s.getLessons().size() : 0)
                        .sum();
                summary.setTotalLessonsCount(totalLessons);
            } else {
                summary.setTotalLessonsCount(0);
            }
            resp.setCourse(summary);
        }

        return resp;
    }

    public EnrollmentResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public CourseSummary getCourse() {
        return course;
    }

    public void setCourse(CourseSummary course) {
        this.course = course;
    }
}
