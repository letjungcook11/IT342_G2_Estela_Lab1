package com.it342.backend.repository;

import com.it342.backend.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByReportIdOrderByChangedAtDesc(Long reportId);
    List<History> findAllByOrderByChangedAtDesc();
}