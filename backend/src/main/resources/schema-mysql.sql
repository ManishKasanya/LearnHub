-- =====================================================================
-- LearnHub Full-Stack Online Learning Platform
-- Final-Year Computer Science Project Database Schema (MySQL 8.0+)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS learnhub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE learnhub_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_STUDENT',
    headline VARCHAR(150),
    bio TEXT,
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(500),
    icon VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_category_slug (slug)
) ENGINE=InnoDB;

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    description TEXT NOT NULL,
    instructor_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    level VARCHAR(20) NOT NULL DEFAULT 'BEGINNER',
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    thumbnail_url VARCHAR(500),
    promo_video_url VARCHAR(500),
    language VARCHAR(50) DEFAULT 'English',
    total_duration_seconds BIGINT DEFAULT 0,
    rejection_reason VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_instructor FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_course_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_course_status (status),
    INDEX idx_course_level (level),
    INDEX idx_course_title (title)
) ENGINE=InnoDB;

-- 4. Sections Table
CREATE TABLE IF NOT EXISTS sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_section_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_section_course (course_id)
) ENGINE=InnoDB;

-- 5. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    section_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT,
    video_url VARCHAR(500),
    duration_seconds INT DEFAULT 0,
    order_index INT NOT NULL DEFAULT 0,
    is_free_preview BOOLEAN NOT NULL DEFAULT FALSE,
    lesson_type VARCHAR(30) NOT NULL DEFAULT 'VIDEO',
    attachment_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lesson_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    INDEX idx_lesson_section (section_id)
) ENGINE=InnoDB;

-- 6. Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    progress_percentage DOUBLE NOT NULL DEFAULT 0.0,
    completed_at TIMESTAMP NULL,
    CONSTRAINT uq_student_course UNIQUE (student_id, course_id),
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_enrollment_student (student_id),
    INDEX idx_enrollment_course (course_id)
) ENGINE=InnoDB;

-- 7. Lesson Progress Table
CREATE TABLE IF NOT EXISTS lesson_progresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    last_watch_position_seconds INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_enrollment_lesson UNIQUE (enrollment_id, lesson_id),
    CONSTRAINT fk_progress_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_progress_enrollment (enrollment_id)
) ENGINE=InnoDB;

-- 8. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    section_id BIGINT NULL,
    course_id BIGINT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    passing_score INT NOT NULL DEFAULT 70,
    time_limit_minutes INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_quiz_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(30) NOT NULL DEFAULT 'SINGLE_CHOICE',
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_option INT NOT NULL DEFAULT 0,
    explanation TEXT,
    points INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    quiz_id BIGINT NOT NULL,
    score_percentage DOUBLE NOT NULL DEFAULT 0.0,
    total_questions INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    is_passed BOOLEAN NOT NULL DEFAULT FALSE,
    time_spent_seconds INT DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attempt_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_attempt_student (student_id)
) ENGINE=InnoDB;

-- 11. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    certificate_code VARCHAR(64) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_url VARCHAR(500),
    CONSTRAINT uq_cert_student_course UNIQUE (student_id, course_id),
    CONSTRAINT fk_cert_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cert_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_cert_code (certificate_code)
) ENGINE=InnoDB;

-- 12. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_review_student_course UNIQUE (student_id, course_id),
    CONSTRAINT fk_review_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_review_course (course_id)
) ENGINE=InnoDB;
