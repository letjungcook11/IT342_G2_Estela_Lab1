package com.it342.backend.repository;

import com.it342.backend.model.Report;
import com.it342.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReporter(User reporter);
    List<Report> findByStatus(String status);
    List<Report> findByPriority(String priority);
}