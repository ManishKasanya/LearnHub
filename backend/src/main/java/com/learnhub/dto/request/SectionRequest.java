package com.learnhub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SectionRequest {

    @NotBlank(message = "Section title is required")
    @Size(max = 150)
    private String title;

    private Integer orderIndex = 0;

    public SectionRequest() {
    }

    public SectionRequest(String title, Integer orderIndex) {
        this.title = title;
        this.orderIndex = orderIndex;
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
}
