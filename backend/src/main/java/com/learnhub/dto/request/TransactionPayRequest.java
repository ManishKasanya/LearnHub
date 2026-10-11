package com.learnhub.dto.request;

import jakarta.validation.constraints.NotNull;

public class TransactionPayRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private String paymentMethod = "UPI"; // UPI, PhonePe, GooglePay, Paytm

    private String payerPhone;

    private String payerUpiId;

    private String utrNumber;

    private String note;

    public TransactionPayRequest() {
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
