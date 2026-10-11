package com.learnhub.dto.response;

import java.util.List;

public class QuizResultResponse {

    private Long quizId;
    private String quizTitle;
    private Double scorePercentage;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private boolean passed;
    private Integer passingScore;
    private Integer timeSpentSeconds;
    private List<QuestionFeedback> feedbackList;

    public static class QuestionFeedback {
        private Long questionId;
        private String questionText;
        private Integer selectedOption;
        private Integer correctOption;
        private boolean correct;
        private String explanation;

        public QuestionFeedback() {
        }

        public QuestionFeedback(Long questionId, String questionText, Integer selectedOption, Integer correctOption, boolean correct, String explanation) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.selectedOption = selectedOption;
            this.correctOption = correctOption;
            this.correct = correct;
            this.explanation = explanation;
        }

        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public Integer getSelectedOption() {
            return selectedOption;
        }

        public void setSelectedOption(Integer selectedOption) {
            this.selectedOption = selectedOption;
        }

        public Integer getCorrectOption() {
            return correctOption;
        }

        public void setCorrectOption(Integer correctOption) {
            this.correctOption = correctOption;
        }

        public boolean isCorrect() {
            return correct;
        }

        public void setCorrect(boolean correct) {
            this.correct = correct;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }
    }

    public QuizResultResponse() {
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public Double getScorePercentage() {
        return scorePercentage;
    }

    public void setScorePercentage(Double scorePercentage) {
        this.scorePercentage = scorePercentage;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public Integer getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Integer passingScore) {
        this.passingScore = passingScore;
    }

    public Integer getTimeSpentSeconds() {
        return timeSpentSeconds;
    }

    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public List<QuestionFeedback> getFeedbackList() {
        return feedbackList;
    }

    public void setFeedbackList(List<QuestionFeedback> feedbackList) {
        this.feedbackList = feedbackList;
    }
}
