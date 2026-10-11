package com.learnhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class LiveClassRequest {

    @NotBlank(message = "Live class title is required")
    @Size(max = 200)
    private String title;

    private String description;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private String meetingUrl;

    private String meetingPlatform = "JITSI"; // JITSI, GOOGLE_MEET, ZOOM, YOUTUBE_LIVE, CUSTOM

    @NotNull(message = "Scheduled start time is required")
    private LocalDateTime scheduledStartTime;

    private Integer durationMinutes = 60;

    public LiveClassRequest() {
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

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledStartTime;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        if (this.scheduledStartTime == null) {
            this.scheduledStartTime = scheduledAt;
        }
    }
}
