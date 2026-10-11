package com.learnhub.dto.response;

import com.learnhub.enums.CourseLevel;
import com.learnhub.enums.CourseStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CourseResponse {

    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private Long instructorId;
    private String instructorName;
    private String instructorHeadline;
    private String instructorAvatarUrl;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private BigDecimal price;
    private CourseLevel level;
    private CourseStatus status;
    private String thumbnailUrl;
    private String promoVideoUrl;
    private String language;
    private Long totalDurationSeconds;
    private LocalDateTime createdAt;
    private Double averageRating;
    private Long reviewsCount;
    private Long enrolledStudentsCount;
    private Integer totalSectionsCount;
    private Integer totalLessonsCount;
    private boolean isEnrolled;
    private Double studentProgressPercentage;
    private List<SectionDto> sections;

    public static class SectionDto {
        private Long id;
        private String title;
        private Integer orderIndex;
        private List<LessonDto> lessons;
        private List<QuizDto> quizzes;

        public SectionDto() {
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

        public Integer getOrderIndex() {
            return orderIndex;
        }

        public void setOrderIndex(Integer orderIndex) {
            this.orderIndex = orderIndex;
        }

        public List<LessonDto> getLessons() {
            return lessons;
        }

        public void setLessons(List<LessonDto> lessons) {
            this.lessons = lessons;
        }

        public List<QuizDto> getQuizzes() {
            return quizzes;
        }

        public void setQuizzes(List<QuizDto> quizzes) {
            this.quizzes = quizzes;
        }
    }

    public static class LessonDto {
        private Long id;
        private String title;
        private String content;
        private String videoUrl;
        private Integer durationSeconds;
        private Integer orderIndex;
        private boolean freePreview;
        private String lessonType;
        private String attachmentUrl;
        private boolean isCompleted;
        private Integer lastWatchPositionSeconds;

        public LessonDto() {
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

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getVideoUrl() {
            return videoUrl;
        }

        public void setVideoUrl(String videoUrl) {
            this.videoUrl = videoUrl;
        }

        public Integer getDurationSeconds() {
            return durationSeconds;
        }

        public void setDurationSeconds(Integer durationSeconds) {
            this.durationSeconds = durationSeconds;
        }

        public Integer getOrderIndex() {
            return orderIndex;
        }

        public void setOrderIndex(Integer orderIndex) {
            this.orderIndex = orderIndex;
        }

        public boolean isFreePreview() {
            return freePreview;
        }

        public void setFreePreview(boolean freePreview) {
            this.freePreview = freePreview;
        }

        public String getLessonType() {
            return lessonType;
        }

        public void setLessonType(String lessonType) {
            this.lessonType = lessonType;
        }

        public String getAttachmentUrl() {
            return attachmentUrl;
        }

        public void setAttachmentUrl(String attachmentUrl) {
            this.attachmentUrl = attachmentUrl;
        }

        public boolean isCompleted() {
            return isCompleted;
        }

        public void setCompleted(boolean completed) {
            isCompleted = completed;
        }

        public Integer getLastWatchPositionSeconds() {
            return lastWatchPositionSeconds;
        }

        public void setLastWatchPositionSeconds(Integer lastWatchPositionSeconds) {
            this.lastWatchPositionSeconds = lastWatchPositionSeconds;
        }
    }

    public static class QuizDto {
        private Long id;
        private String title;
        private String description;
        private Integer passingScore;
        private Integer timeLimitMinutes;
        private Integer questionCount;
        private boolean isPassed;
        private Double highestScore;

        public QuizDto() {
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

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Integer getPassingScore() {
            return passingScore;
        }

        public void setPassingScore(Integer passingScore) {
            this.passingScore = passingScore;
        }

        public Integer getTimeLimitMinutes() {
            return timeLimitMinutes;
        }

        public void setTimeLimitMinutes(Integer timeLimitMinutes) {
            this.timeLimitMinutes = timeLimitMinutes;
        }

        public Integer getQuestionCount() {
            return questionCount;
        }

        public void setQuestionCount(Integer questionCount) {
            this.questionCount = questionCount;
        }

        public boolean isPassed() {
            return isPassed;
        }

        public void setPassed(boolean passed) {
            isPassed = passed;
        }

        public Double getHighestScore() {
            return highestScore;
        }

        public void setHighestScore(Double highestScore) {
            this.highestScore = highestScore;
        }
    }

    public CourseResponse() {
    }

    // Getters and Setters
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public String getInstructorHeadline() {
        return instructorHeadline;
    }

    public void setInstructorHeadline(String instructorHeadline) {
        this.instructorHeadline = instructorHeadline;
    }

    public String getInstructorAvatarUrl() {
        return instructorAvatarUrl;
    }

    public void setInstructorAvatarUrl(String instructorAvatarUrl) {
        this.instructorAvatarUrl = instructorAvatarUrl;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategorySlug() {
        return categorySlug;
    }

    public void setCategorySlug(String categorySlug) {
        this.categorySlug = categorySlug;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public CourseLevel getLevel() {
        return level;
    }

    public void setLevel(CourseLevel level) {
        this.level = level;
    }

    public CourseStatus getStatus() {
        return status;
    }

    public void setStatus(CourseStatus status) {
        this.status = status;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getPromoVideoUrl() {
        return promoVideoUrl;
    }

    public void setPromoVideoUrl(String promoVideoUrl) {
        this.promoVideoUrl = promoVideoUrl;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Long getTotalDurationSeconds() {
        return totalDurationSeconds;
    }

    public void setTotalDurationSeconds(Long totalDurationSeconds) {
        this.totalDurationSeconds = totalDurationSeconds;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Long reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public Long getEnrolledStudentsCount() {
        return enrolledStudentsCount;
    }

    public void setEnrolledStudentsCount(Long enrolledStudentsCount) {
        this.enrolledStudentsCount = enrolledStudentsCount;
    }

    public Integer getTotalSectionsCount() {
        return totalSectionsCount;
    }

    public void setTotalSectionsCount(Integer totalSectionsCount) {
        this.totalSectionsCount = totalSectionsCount;
    }

    public Integer getTotalLessonsCount() {
        return totalLessonsCount;
    }

    public void setTotalLessonsCount(Integer totalLessonsCount) {
        this.totalLessonsCount = totalLessonsCount;
    }

    public boolean isEnrolled() {
        return isEnrolled;
    }

    public void setEnrolled(boolean enrolled) {
        isEnrolled = enrolled;
    }

    public Double getStudentProgressPercentage() {
        return studentProgressPercentage;
    }

    public void setStudentProgressPercentage(Double studentProgressPercentage) {
        this.studentProgressPercentage = studentProgressPercentage;
    }

    public List<SectionDto> getSections() {
        return sections;
    }

    public void setSections(List<SectionDto> sections) {
        this.sections = sections;
    }

    public static class InstructorSummary {
        private Long id;
        private String fullName;
        private String headline;
        private String avatarUrl;

        public InstructorSummary() {}
        public InstructorSummary(Long id, String fullName, String headline, String avatarUrl) {
            this.id = id;
            this.fullName = fullName;
            this.headline = headline;
            this.avatarUrl = avatarUrl;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getHeadline() { return headline; }
        public void setHeadline(String headline) { this.headline = headline; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }

    public static class CategorySummary {
        private Long id;
        private String name;
        private String slug;

        public CategorySummary() {}
        public CategorySummary(Long id, String name, String slug) {
            this.id = id;
            this.name = name;
            this.slug = slug;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }
    }

    public InstructorSummary getInstructor() {
        if (instructorId == null && instructorName == null) return null;
        return new InstructorSummary(instructorId, instructorName, instructorHeadline, instructorAvatarUrl);
    }

    public CategorySummary getCategory() {
        if (categoryId == null && categoryName == null) return null;
        return new CategorySummary(categoryId, categoryName, categorySlug);
    }
}
