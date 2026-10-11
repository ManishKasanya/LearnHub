package com.learnhub.entity;

import com.learnhub.enums.TransactionStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_code", unique = true, nullable = false, length = 64)
    private String transactionCode;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @NotNull
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 10)
    private String currency = "INR";

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod = "UPI";

    @Column(name = "payee_phone_number", nullable = false, length = 20)
    private String payeePhoneNumber = "8251085981";

    @Column(name = "payee_upi_id", nullable = false, length = 50)
    private String payeeUpiId = "8251085981@upi";

    @Column(name = "payer_phone", length = 20)
    private String payerPhone;

    @Column(name = "payer_upi_id", length = 100)
    private String payerUpiId;

    @Column(name = "utr_number", length = 64)
    private String utrNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TransactionStatus status = TransactionStatus.COMPLETED;

    @Column(name = "note", length = 500)
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public Transaction() {
    }

    public Transaction(String transactionCode, User student, Course course, BigDecimal amount,
                       String paymentMethod, String payeePhoneNumber, String payeeUpiId,
                       String payerPhone, String payerUpiId, String utrNumber,
                       TransactionStatus status, String note) {
        this.transactionCode = transactionCode;
        this.student = student;
        this.course = course;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.payeePhoneNumber = payeePhoneNumber;
        this.payeeUpiId = payeeUpiId;
        this.payerPhone = payerPhone;
        this.payerUpiId = payerUpiId;
        this.utrNumber = utrNumber;
        this.status = status;
        this.note = note;
        this.currency = "INR";
        this.completedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionCode() {
        return transactionCode;
    }

    public void setTransactionCode(String transactionCode) {
        this.transactionCode = transactionCode;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPayeePhoneNumber() {
        return payeePhoneNumber;
    }

    public void setPayeePhoneNumber(String payeePhoneNumber) {
        this.payeePhoneNumber = payeePhoneNumber;
    }

    public String getPayeeUpiId() {
        return payeeUpiId;
    }

    public void setPayeeUpiId(String payeeUpiId) {
        this.payeeUpiId = payeeUpiId;
    }

    public String getPayerPhone() {
        return payerPhone;
    }

    public void setPayerPhone(String payerPhone) {
        this.payerPhone = payerPhone;
    }

    public String getPayerUpiId() {
        return payerUpiId;
    }

    public void setPayerUpiId(String payerUpiId) {
        this.payerUpiId = payerUpiId;
    }

    public String getUtrNumber() {
        return utrNumber;
    }

    public void setUtrNumber(String utrNumber) {
        this.utrNumber = utrNumber;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
