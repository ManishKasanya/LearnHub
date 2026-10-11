package com.learnhub.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStatsResponse {

    // General & Admin Metrics
    private long totalUsers;
    private long totalStudents;
    private long totalInstructors;
    private long totalCourses;
    private long publishedCourses;
    private long pendingApprovalCourses;
    private long totalEnrollments;
    private long totalCertificatesIssued;
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    // Student Specific Metrics
    private long studentEnrolledCourses;
    private long studentCompletedCourses;
    private long studentCertificates;
    private long studentQuizzesPassed;

    // Instructor Specific Metrics
    private long instructorCoursesCreated;
    private long instructorTotalStudents;

    private Map<String, Object> additionalStats;

    public DashboardStatsResponse() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalInstructors() {
        return totalInstructors;
    }

    public void setTotalInstructors(long totalInstructors) {
        this.totalInstructors = totalInstructors;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getPublishedCourses() {
        return publishedCourses;
    }

    public void setPublishedCourses(long publishedCourses) {
        this.publishedCourses = publishedCourses;
    }

    public long getPendingApprovalCourses() {
        return pendingApprovalCourses;
    }

    public void setPendingApprovalCourses(long pendingApprovalCourses) {
        this.pendingApprovalCourses = pendingApprovalCourses;
    }

    public long getTotalEnrollments() {
        return totalEnrollments;
    }

    public void setTotalEnrollments(long totalEnrollments) {
        this.totalEnrollments = totalEnrollments;
    }

    public long getTotalCertificatesIssued() {
        return totalCertificatesIssued;
    }

    public void setTotalCertificatesIssued(long totalCertificatesIssued) {
        this.totalCertificatesIssued = totalCertificatesIssued;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getStudentEnrolledCourses() {
        return studentEnrolledCourses;
    }

    public void setStudentEnrolledCourses(long studentEnrolledCourses) {
        this.studentEnrolledCourses = studentEnrolledCourses;
    }

    public long getStudentCompletedCourses() {
        return studentCompletedCourses;
    }

    public void setStudentCompletedCourses(long studentCompletedCourses) {
        this.studentCompletedCourses = studentCompletedCourses;
    }

    public long getStudentCertificates() {
        return studentCertificates;
    }

    public void setStudentCertificates(long studentCertificates) {
        this.studentCertificates = studentCertificates;
    }

    public long getStudentQuizzesPassed() {
        return studentQuizzesPassed;
    }

    public void setStudentQuizzesPassed(long studentQuizzesPassed) {
        this.studentQuizzesPassed = studentQuizzesPassed;
    }

    public long getInstructorCoursesCreated() {
        return instructorCoursesCreated;
    }

    public void setInstructorCoursesCreated(long instructorCoursesCreated) {
        this.instructorCoursesCreated = instructorCoursesCreated;
    }

    public long getInstructorTotalStudents() {
        return instructorTotalStudents;
    }

    public void setInstructorTotalStudents(long instructorTotalStudents) {
        this.instructorTotalStudents = instructorTotalStudents;
    }

    public Map<String, Object> getAdditionalStats() {
        return additionalStats;
    }

    public void setAdditionalStats(Map<String, Object> additionalStats) {
        this.additionalStats = additionalStats;
    }
}
