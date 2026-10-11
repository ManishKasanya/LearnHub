package com.learnhub.service;

import com.learnhub.dto.request.TransactionPayRequest;
import com.learnhub.dto.response.TransactionResponse;
import com.learnhub.entity.Course;
import com.learnhub.entity.Transaction;
import com.learnhub.entity.User;
import com.learnhub.enums.TransactionStatus;
import com.learnhub.exception.BadRequestException;
import com.learnhub.exception.ResourceNotFoundException;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.EnrollmentRepository;
import com.learnhub.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    public static final String TARGET_PHONE_NUMBER = "8251085981";
    public static final String TARGET_UPI_ID = "8251085981@upi";
    public static final String TARGET_PAYEE_NAME = "LearnHub Official";

    private final TransactionRepository transactionRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentService enrollmentService;

    public TransactionService(
            TransactionRepository transactionRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            EnrollmentService enrollmentService) {
        this.transactionRepository = transactionRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.enrollmentService = enrollmentService;
    }

    public Map<String, Object> getPaymentConfig(Long courseId) {
        Map<String, Object> config = new HashMap<>();
        config.put("recipientPhoneNumber", TARGET_PHONE_NUMBER);
        config.put("recipientUpiId", TARGET_UPI_ID);
        config.put("payeeName", TARGET_PAYEE_NAME);
        config.put("currency", "INR");

        if (courseId != null) {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
            config.put("courseId", course.getId());
            config.put("courseTitle", course.getTitle());
            config.put("amount", course.getPrice());
            // Format standard UPI payment URI
            String upiUri = String.format("upi://pay?pa=%s&pn=%s&am=%s&cu=INR&tn=LearnHubCourse%d",
                    TARGET_UPI_ID,
                    TARGET_PAYEE_NAME.replace(" ", "%20"),
                    course.getPrice() != null ? course.getPrice().toPlainString() : "0.00",
                    course.getId());
            config.put("upiUri", upiUri);
        }
        return config;
    }

    @Transactional
    public TransactionResponse processCoursePayment(TransactionPayRequest request, User student) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            throw new BadRequestException("You are already enrolled in this course");
        }

        // Generate unique transaction code featuring recipient number 8251085981
        String txnSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String transactionCode = "TXN-8251085981-" + System.currentTimeMillis() % 1000000 + "-" + txnSuffix;

        String utr = request.getUtrNumber();
        if (utr == null || utr.trim().isEmpty()) {
            utr = "UTR" + System.currentTimeMillis() + (int)(Math.random() * 900 + 100);
        }

        BigDecimal amount = course.getPrice() != null ? course.getPrice() : BigDecimal.ZERO;
        String paymentMethod = (request.getPaymentMethod() != null && !request.getPaymentMethod().trim().isEmpty())
                ? request.getPaymentMethod()
                : "UPI";

        Transaction transaction = new Transaction();
        transaction.setTransactionCode(transactionCode);
        transaction.setStudent(student);
        transaction.setCourse(course);
        transaction.setAmount(amount);
        transaction.setCurrency("INR");
        transaction.setPaymentMethod(paymentMethod);
        transaction.setPayeePhoneNumber(TARGET_PHONE_NUMBER);
        transaction.setPayeeUpiId(TARGET_UPI_ID);
        transaction.setPayerPhone(request.getPayerPhone());
        transaction.setPayerUpiId(request.getPayerUpiId());
        transaction.setUtrNumber(utr);
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setCompletedAt(LocalDateTime.now());
        transaction.setNote(request.getNote() != null ? request.getNote() : "Payment to " + TARGET_PHONE_NUMBER + " for " + course.getTitle());

        Transaction saved = transactionRepository.save(transaction);
        log.info("Transaction completed successfully: {} for course {} on recipient {}", saved.getTransactionCode(), course.getId(), TARGET_PHONE_NUMBER);

        // Perform course enrollment
        enrollmentService.enrollCourse(course.getId(), student);

        return TransactionResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getStudentTransactions(User student, Pageable pageable) {
        return transactionRepository.findByStudentOrderByCreatedAtDesc(student, pageable)
                .map(TransactionResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(TransactionResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalCompletedRevenue() {
        return transactionRepository.sumTotalRevenueByStatus(TransactionStatus.COMPLETED);
    }
}
