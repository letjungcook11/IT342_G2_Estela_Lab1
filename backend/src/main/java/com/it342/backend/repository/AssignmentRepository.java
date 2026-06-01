package com.it342.backend.repository;

import com.it342.backend.model.Assignment;
import com.it342.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByEmployee(User employee);
    Optional<Assignment> findByReportId(Long reportId);
}