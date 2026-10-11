package com.learnhub.service;

import com.learnhub.dto.request.QuizSubmitRequest;
import com.learnhub.dto.response.QuizResultResponse;
import com.learnhub.entity.*;
import com.learnhub.exception.BadRequestException;
import com.learnhub.exception.ResourceNotFoundException;
import com.learnhub.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public QuizService(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            QuizAttemptRepository quizAttemptRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    @Transactional(readOnly = true)
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", id));
    }

    @Transactional
    public QuizResultResponse submitQuiz(Long quizId, QuizSubmitRequest request, User student) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        List<Question> questions = questionRepository.findByQuizIdOrderByIdAsc(quizId);
        if (questions.isEmpty()) {
            throw new BadRequestException("This quiz has no questions");
        }

        Map<Long, Integer> submittedAnswers = request.getAnswers();
        int totalQuestions = questions.size();
        int correctCount = 0;

        List<QuizResultResponse.QuestionFeedback> feedbackList = new ArrayList<>();

        for (Question q : questions) {
            Integer userSelected = submittedAnswers.get(q.getId());
            boolean isCorrect = (userSelected != null && userSelected.equals(q.getCorrectOption()));

            if (isCorrect) {
                correctCount++;
            }

            feedbackList.add(new QuizResultResponse.QuestionFeedback(
                    q.getId(),
                    q.getQuestionText(),
                    userSelected,
                    q.getCorrectOption(),
                    isCorrect,
                    q.getExplanation()
            ));
        }

        double scorePercentage = ((double) correctCount / (double) totalQuestions) * 100.0;
        double roundedScore = Math.round(scorePercentage * 10.0) / 10.0;
        boolean passed = roundedScore >= quiz.getPassingScore();

        // Record attempt in database
        QuizAttempt attempt = new QuizAttempt(
                student,
                quiz,
                roundedScore,
                totalQuestions,
                correctCount,
                passed,
                request.getTimeSpentSeconds()
        );
        quizAttemptRepository.save(attempt);

        QuizResultResponse response = new QuizResultResponse();
        response.setQuizId(quiz.getId());
        response.setQuizTitle(quiz.getTitle());
        response.setScorePercentage(roundedScore);
        response.setTotalQuestions(totalQuestions);
        response.setCorrectAnswers(correctCount);
        response.setPassed(passed);
        response.setPassingScore(quiz.getPassingScore());
        response.setTimeSpentSeconds(request.getTimeSpentSeconds());
        response.setFeedbackList(feedbackList);

        return response;
    }

    @Transactional(readOnly = true)
    public List<QuizAttempt> getStudentAttemptsForQuiz(Long quizId, User student) {
        return quizAttemptRepository.findByStudentIdAndQuizIdOrderBySubmittedAtDesc(student.getId(), quizId);
    }
}
