package com.learnhub.config;

import com.learnhub.entity.*;
import com.learnhub.enums.*;
import com.learnhub.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionRepository transactionRepository;

    @Value("${learnhub.app.uploadDir:./uploads}")
    private String uploadDir;

    public DataInitializer(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            CourseRepository courseRepository,
            SectionRepository sectionRepository,
            LessonRepository lessonRepository,
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            EnrollmentRepository enrollmentRepository,
            LessonProgressRepository lessonProgressRepository,
            PasswordEncoder passwordEncoder,
            TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.passwordEncoder = passwordEncoder;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public void run(String... args) {
        createUploadDirectories();
        seedUsers();
        seedCategories();
        seedSampleCourse();
        seedSampleTransactions();
    }

    private void seedSampleTransactions() {
        if (transactionRepository.count() == 0) {
            User alice = userRepository.findByEmail("alice.student@learnhub.com").orElse(null);
            Course course = courseRepository.findAll().stream().findFirst().orElse(null);
            if (alice != null && course != null) {
                Transaction txn = new Transaction(
                        "TXN-8251085981-INIT01",
                        alice,
                        course,
                        course.getPrice() != null ? course.getPrice() : new BigDecimal("1499.00"),
                        "PhonePe UPI",
                        "8251085981",
                        "8251085981@upi",
                        "+91 98765 43210",
                        "alice@okaxis",
                        "UTR825108598101",
                        TransactionStatus.COMPLETED,
                        "Initial paid course enrollment via UPI to 8251085981"
                );
                transactionRepository.save(txn);
                log.info("Initial seed transaction recorded for 8251085981");
            }
        }
    }

    private void createUploadDirectories() {
        List<String> subdirs = Arrays.asList(
                uploadDir + "/thumbnails",
                uploadDir + "/videos",
                uploadDir + "/avatars",
                uploadDir + "/documents",
                uploadDir + "/certificates"
        );
        for (String dirPath : subdirs) {
            File dir = new File(dirPath);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                if (created) {
                    log.info("Created upload directory: {}", dirPath);
                }
            }
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            log.info("Seeding initial users (Admin, Instructor, Student)...");

            // 1. Admin
            User admin = new User();
            admin.setFullName("Platform Administrator");
            admin.setEmail("admin@learnhub.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setHeadline("LearnHub System Administrator");
            admin.setBio("Chief system administrator managing platform courses, categories, and accounts.");
            admin.setActive(true);
            userRepository.save(admin);

            // 2. Instructor
            User instructor = new User();
            instructor.setFullName("Dr. John Anderson");
            instructor.setEmail("john.instructor@learnhub.com");
            instructor.setPassword(passwordEncoder.encode("Instructor@123"));
            instructor.setRole(Role.ROLE_INSTRUCTOR);
            instructor.setHeadline("Senior Software Architect & CS Professor");
            instructor.setBio("15+ years experience building enterprise distributed systems and mentoring over 50,000 developers worldwide.");
            instructor.setActive(true);
            userRepository.save(instructor);

            // 3. Student
            User student = new User();
            student.setFullName("Alice Sharma");
            student.setEmail("alice.student@learnhub.com");
            student.setPassword(passwordEncoder.encode("Student@123"));
            student.setRole(Role.ROLE_STUDENT);
            student.setHeadline("Computer Science Undergraduate");
            student.setBio("Final year computer science student enthusiastic about modern full-stack web engineering and cloud systems.");
            student.setActive(true);
            userRepository.save(student);

            log.info("Default users seeded successfully!");
        }

        // Ensure Manish (Super Admin) account exists with ROLE_ADMIN
        if (!userRepository.existsByEmail("manis@learnhub.com")) {
            User manish = new User();
            manish.setFullName("Manish (Super Admin)");
            manish.setEmail("manis@learnhub.com");
            manish.setPassword(passwordEncoder.encode("Admin@123"));
            manish.setRole(Role.ROLE_ADMIN);
            manish.setHeadline("Lead System Administrator & Database Architect");
            manish.setBio("Super Administrator with full master access to platform courses, user records, and database tables.");
            manish.setActive(true);
            userRepository.save(manish);
            log.info("Super Admin Manish created successfully with email: manis@learnhub.com");
        }

        userRepository.findByEmail("manishkasanya191@gmail.com").ifPresent(u -> {
            if (u.getRole() != Role.ROLE_ADMIN) {
                u.setRole(Role.ROLE_ADMIN);
                userRepository.save(u);
                log.info("manishkasanya191@gmail.com promoted to ROLE_ADMIN");
            }
        });
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            log.info("Seeding initial categories...");

            List<Category> categories = Arrays.asList(
                    new Category("Web Development", "web-development", "Build modern responsive websites and enterprise web applications.", "code"),
                    new Category("Data Science & AI", "data-science-ai", "Master machine learning, deep learning, Python, and data analytics.", "brain"),
                    new Category("Cloud & DevOps", "cloud-devops", "Deploy, automate, and scale with Docker, Kubernetes, CI/CD, and AWS.", "cloud"),
                    new Category("Cybersecurity", "cybersecurity", "Network defense, ethical hacking, secure coding, and cryptography.", "shield"),
                    new Category("Mobile App Development", "mobile-development", "Create high-performance iOS & Android applications with React Native & Flutter.", "smartphone")
            );

            categoryRepository.saveAll(categories);
            log.info("Default categories seeded successfully!");
        }
    }

    private void seedSampleCourse() {
        if (courseRepository.count() == 0) {
            log.info("Seeding sample showcase course with sections, lessons, and quiz...");

            User instructor = userRepository.findByEmail("john.instructor@learnhub.com").orElse(null);
            Category category = categoryRepository.findBySlug("web-development").orElse(null);

            if (instructor == null || category == null) {
                return;
            }

            Course course = new Course();
            course.setTitle("Full-Stack Enterprise Development with React & Spring Boot");
            course.setSubtitle("Master end-to-end full-stack development with Java 17, Spring Boot 3, MySQL, and React.js");
            course.setDescription("Comprehensive, hands-on masterclass designed for university students and budding software engineers. Learn to build modern, production-ready web applications from scratch, implementing secure JWT authentication, responsive dashboards, RESTful APIs, and relational database modeling.");
            course.setInstructor(instructor);
            course.setCategory(category);
            course.setPrice(new BigDecimal("1499.00"));
            course.setLevel(CourseLevel.BEGINNER);
            course.setStatus(CourseStatus.PUBLISHED);
            course.setLanguage("English");
            course.setTotalDurationSeconds(7200L); // 2 hours
            Course savedCourse = courseRepository.save(course);

            // Section 1
            Section section1 = new Section(savedCourse, "Section 1: Architecture & Environment Setup", 1);
            Section savedSec1 = sectionRepository.save(section1);

            Lesson lesson1 = new Lesson(savedSec1, "Welcome to Full-Stack Architecture", 1, LessonType.VIDEO);
            lesson1.setDurationSeconds(600);
            lesson1.setFreePreview(true);
            lesson1.setContent("Welcome to LearnHub! In this introductory lecture, we explore the multi-tier client-server architecture, MVC patterns, and decoupled frontends.");
            lessonRepository.save(lesson1);

            Lesson lesson2 = new Lesson(savedSec1, "Setting Up Java 17 & MySQL Workspace", 2, LessonType.ARTICLE);
            lesson2.setDurationSeconds(900);
            lesson2.setFreePreview(true);
            lesson2.setContent("Step-by-step walkthrough to configure your JDK 17, MySQL 8.0 server, schema permissions, and Maven build tooling.");
            lessonRepository.save(lesson2);

            // Section 2
            Section section2 = new Section(savedCourse, "Section 2: Spring Boot 3 & Security Deep Dive", 2);
            Section savedSec2 = sectionRepository.save(section2);

            Lesson lesson3 = new Lesson(savedSec2, "Building JPA Entities & Repositories", 1, LessonType.VIDEO);
            lesson3.setDurationSeconds(1200);
            lesson3.setFreePreview(false);
            lesson3.setContent("Learn how to map relational tables to Java POJOs using Hibernate and Spring Data JPA interfaces.");
            lessonRepository.save(lesson3);

            Lesson lesson4 = new Lesson(savedSec2, "Implementing Stateless JWT Authentication", 2, LessonType.VIDEO);
            lesson4.setDurationSeconds(1500);
            lesson4.setFreePreview(false);
            lesson4.setContent("In-depth walkthrough of JSON Web Tokens, cryptographic signing, expiration, and Spring Security filters.");
            lessonRepository.save(lesson4);

            // Quiz in Section 2
            Quiz quiz = new Quiz("Spring Boot & Modern Web Architecture Quiz", 70, 10);
            quiz.setDescription("Test your fundamental knowledge of Spring Boot, REST APIs, and authentication mechanisms.");
            quiz.setSection(savedSec2);
            quiz.setCourse(savedCourse);
            Quiz savedQuiz = quizRepository.save(quiz);

            Question q1 = new Question(
                    savedQuiz,
                    "Which HTTP status code is returned when authentication credentials are invalid or missing?",
                    "200 OK",
                    "400 Bad Request",
                    "401 Unauthorized",
                    "500 Internal Server Error",
                    2, // Option C (0-indexed: 2)
                    "HTTP 401 Unauthorized indicates that the request has not been applied because it lacks valid authentication credentials."
            );
            questionRepository.save(q1);

            Question q2 = new Question(
                    savedQuiz,
                    "What is the primary benefit of stateless JWT authentication over session cookies?",
                    "JWT does not require server-side session memory storage, making it horizontally scalable.",
                    "JWT is always encrypted by default with AES-256.",
                    "JWT completely eliminates the need for user passwords.",
                    "JWT can only be decrypted by the database engine.",
                    0, // Option A (0-indexed: 0)
                    "Stateless JWT tokens encapsulate the user claims cryptographically, eliminating server-side session state lookups."
            );
            questionRepository.save(q2);

            // Sample Enrollment for Alice
            User student = userRepository.findByEmail("alice.student@learnhub.com").orElse(null);
            if (student != null) {
                Enrollment enrollment = new Enrollment(student, savedCourse);
                enrollment.setProgressPercentage(50.0);
                Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

                LessonProgress progress1 = new LessonProgress(savedEnrollment, lesson1);
                progress1.setCompleted(true);
                lessonProgressRepository.save(progress1);

                LessonProgress progress2 = new LessonProgress(savedEnrollment, lesson2);
                progress2.setCompleted(true);
                lessonProgressRepository.save(progress2);
            }

            log.info("Sample course, curriculum, and enrollment seeded successfully!");
        } else {
            courseRepository.findAll().forEach(c -> {
                if (c.getPrice() != null && c.getPrice().compareTo(new BigDecimal("100")) < 0) {
                    c.setPrice(new BigDecimal("1499.00"));
                    courseRepository.save(c);
                }
            });
        }
    }
}
