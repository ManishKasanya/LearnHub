package com.learnhub.repository;

import com.learnhub.entity.LiveClass;
import com.learnhub.enums.LiveClassStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LiveClassRepository extends JpaRepository<LiveClass, Long> {

    List<LiveClass> findByInstructorIdOrderByScheduledStartTimeDesc(Long instructorId);

    List<LiveClass> findByCourseIdOrderByScheduledStartTimeDesc(Long courseId);

    List<LiveClass> findByStatusOrderByScheduledStartTimeAsc(LiveClassStatus status);

    List<LiveClass> findByStatusInOrderByScheduledStartTimeAsc(List<LiveClassStatus> statuses);

    List<LiveClass> findByCourseIdInOrderByScheduledStartTimeDesc(List<Long> courseIds);
}
