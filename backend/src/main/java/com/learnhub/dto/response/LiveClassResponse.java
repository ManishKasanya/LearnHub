package com.learnhub.dto.response;

import com.learnhub.enums.LiveClassStatus;

import java.time.LocalDateTime;

public class LiveClassResponse {

    private Long id;
    private String title;
    private String description;
    private Long courseId;
    private String courseTitle;
    private String courseThumbnailUrl;
    private Long instructorId;
    private String instructorName;
    private String instructorHeadline;
    private String instructorAvatarUrl;
    private String meetingUrl;
    private String meetingPlatform;
    private LocalDateTime scheduledStartTime;
    private Integer durationMinutes;
    private LiveClassStatus status;
    private String recordingUrl;
    private LocalDateTime createdAt;
    private boolean isLiveNow;

    public LiveClassResponse() {
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

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCourseThumbnailUrl() {
        return courseThumbnailUrl;
    }

    public void setCourseThumbnailUrl(String courseThumbnailUrl) {
        this.courseThumbnailUrl = courseThumbnailUrl;
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

    public String getMeetingUrl() {
        return meetingUrl;
    }

    public void setMeetingUrl(String meetingUrl) {
        this.meetingUrl = meetingUrl;
    }

    public String getMeetingPlatform() {
        return meetingPlatform;
    }

    public void setMeetingPlatform(String meetingPlatform) {
        this.meetingPlatform = meetingPlatform;
    }

    public LocalDateTime getScheduledStartTime() {
        return scheduledStartTime;
    }

    public void setScheduledStartTime(LocalDateTime scheduledStartTime) {
        this.scheduledStartTime = scheduledStartTime;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledStartTime;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledStartTime = scheduledAt;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LiveClassStatus getStatus() {
        return status;
    }

    public void setStatus(LiveClassStatus status) {
        this.status = status;
    }

    public String getRecordingUrl() {
        return recordingUrl;
    }

    public void setRecordingUrl(String recordingUrl) {
        this.recordingUrl = recordingUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isLiveNow() {
        return isLiveNow;
    }

    public void setLiveNow(boolean liveNow) {
        isLiveNow = liveNow;
    }
}
