package com.learnhub.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class QuizSubmitRequest {

    // Map: questionId -> selectedOptionIndex (0 = A, 1 = B, 2 = C, 3 = D)
    @NotNull(message = "Answers map is required")
    private Map<Long, Integer> answers;

    private Integer timeSpentSeconds = 0;

    public QuizSubmitRequest() {
    }

    public QuizSubmitRequest(Map<Long, Integer> answers, Integer timeSpentSeconds) {
        this.answers = answers;
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public Map<Long, Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, Integer> answers) {
        this.answers = answers;
    }

    public Integer getTimeSpentSeconds() {
        return timeSpentSeconds;
    }

    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }
}
