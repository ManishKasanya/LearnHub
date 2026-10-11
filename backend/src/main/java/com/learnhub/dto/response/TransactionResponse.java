package com.learnhub.dto.response;

import com.learnhub.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private String transactionCode;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long courseId;
    private String courseTitle;
    private String courseThumbnailUrl;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String payeePhoneNumber;
    private String payeeUpiId;
    private String payerPhone;
    private String payerUpiId;
    private String utrNumber;
    private String status;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public TransactionResponse() {
    }

    public static TransactionResponse fromEntity(Transaction t) {
        TransactionResponse res = new TransactionResponse();
        res.setId(t.getId());
        res.setTransactionCode(t.getTransactionCode());
        if (t.getStudent() != null) {
            res.setStudentId(t.getStudent().getId());
            res.setStudentName(t.getStudent().getFullName());
            res.setStudentEmail(t.getStudent().getEmail());
        }
        if (t.getCourse() != null) {
            res.setCourseId(t.getCourse().getId());
            res.setCourseTitle(t.getCourse().getTitle());
            res.setCourseThumbnailUrl(t.getCourse().getThumbnailUrl());
        }
        res.setAmount(t.getAmount());
        res.setCurrency(t.getCurrency());
        res.setPaymentMethod(t.getPaymentMethod());
        res.setPayeePhoneNumber(t.getPayeePhoneNumber());
        res.setPayeeUpiId(t.getPayeeUpiId());
        res.setPayerPhone(t.getPayerPhone());
        res.setPayerUpiId(t.getPayerUpiId());
        res.setUtrNumber(t.getUtrNumber());
        res.setStatus(t.getStatus() != null ? t.getStatus().name() : "COMPLETED");
        res.setNote(t.getNote());
        res.setCreatedAt(t.getCreatedAt());
        res.setCompletedAt(t.getCompletedAt());
        return res;
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

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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
