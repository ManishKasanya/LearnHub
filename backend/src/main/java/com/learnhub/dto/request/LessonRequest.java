package com.learnhub.dto.request;

import com.learnhub.enums.LessonType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LessonRequest {

    @NotBlank(message = "Lesson title is required")
    @Size(max = 200)
    private String title;

    private String content;

    private String videoUrl;

    private Integer durationSeconds = 0;

    private Integer orderIndex = 0;

    private boolean freePreview = false;

    private LessonType lessonType = LessonType.VIDEO;

    private String attachmentUrl;

    public LessonRequest() {
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

    public LessonType getLessonType() {
        return lessonType;
    }

    public void setLessonType(LessonType lessonType) {
        this.lessonType = lessonType;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }
}
