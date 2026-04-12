package com.it342.backend.controller;

import com.it342.backend.model.*;
import com.it342.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired private ReportRepository reportRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private AssignmentRepository assignmentRepository;
    @Autowired private HistoryRepository historyRepository;

    // Get all reports (employee sees all, student sees own)
    @GetMapping
    public ResponseEntity<?> getAllReports(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        if (user.getRole().equals("EMPLOYEE")) {
            return ResponseEntity.ok(reportRepository.findAll());
        }
        return ResponseEntity.ok(reportRepository.findByReporter(user));
    }

    // Submit a report (student)
    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody Map<String, Object> body, Authentication auth) {
        User reporter = userRepository.findByEmail(auth.getName()).orElseThrow();

        Report report = new Report();
        report.setTitle((String) body.get("title"));
        report.setDescription((String) body.get("description"));
        report.setLocation((String) body.get("location"));
        report.setPriority((String) body.get("priority"));
        report.setReporter(reporter);

        Long categoryId = Long.valueOf(body.get("categoryId").toString());
        categoryRepository.findById(categoryId).ifPresent(report::setCategory);

        reportRepository.save(report);

        History history = new History();
        history.setReport(report);
        history.setChangedBy(reporter);
        history.setOldStatus(null);
        history.setNewStatus("PENDING");
        history.setNotes("Report submitted");
        historyRepository.save(history);

        return ResponseEntity.ok(report);
    }

    // Update report status (employee)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody Map<String, String> body,
                                          Authentication auth) {
        User employee = userRepository.findByEmail(auth.getName()).orElseThrow();
        Report report = reportRepository.findById(id).orElseThrow();

        String oldStatus = report.getStatus();
        String newStatus = body.get("status");
        report.setStatus(newStatus);
        report.setUpdatedAt(LocalDateTime.now());
        reportRepository.save(report);

        if (newStatus.equals("COMPLETED")) {
            assignmentRepository.findByReportId(id).ifPresent(a -> {
                a.setCompletedAt(LocalDateTime.now());
                a.setRemarks(body.getOrDefault("remarks", ""));
                assignmentRepository.save(a);
            });
        }

        History history = new History();
        history.setReport(report);
        history.setChangedBy(employee);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setNotes(body.getOrDefault("notes", ""));
        historyRepository.save(history);

        return ResponseEntity.ok(report);
    }

    // Assign employee to report
    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignReport(@PathVariable Long id,
                                          @RequestBody Map<String, Object> body,
                                          Authentication auth) {
        Report report = reportRepository.findById(id).orElseThrow();
        Long employeeId = Long.valueOf(body.get("employeeId").toString());
        User employee = userRepository.findById(employeeId).orElseThrow();

        Assignment assignment = new Assignment();
        assignment.setReport(report);
        assignment.setEmployee(employee);
        assignmentRepository.save(assignment);

        report.setStatus("ASSIGNED");
        report.setUpdatedAt(LocalDateTime.now());
        reportRepository.save(report);

        User assigner = userRepository.findByEmail(auth.getName()).orElseThrow();
        History history = new History();
        history.setReport(report);
        history.setChangedBy(assigner);
        history.setOldStatus("PENDING");
        history.setNewStatus("ASSIGNED");
        history.setNotes("Assigned to " + employee.getUsername());
        historyRepository.save(history);

        return ResponseEntity.ok(assignment);
    }

    // Get all categories
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // Get history for a specific report
    @GetMapping("/{id}/history")
    public ResponseEntity<?> getReportHistory(@PathVariable Long id) {
        return ResponseEntity.ok(historyRepository.findByReportIdOrderByChangedAtDesc(id));
    }

    // Get all history (campus-wide fix history)
    @GetMapping("/history")
    public ResponseEntity<?> getAllHistory() {
        return ResponseEntity.ok(historyRepository.findAllByOrderByChangedAtDesc());
    }
}