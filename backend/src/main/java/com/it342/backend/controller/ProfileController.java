package com.it342.backend.controller;

import com.it342.backend.model.User;
import com.it342.backend.repository.UserRepository;
import com.it342.backend.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired private UserRepository userRepository;
    @Autowired private StorageService storageService;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body,
                                           Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        if (body.containsKey("username"))   user.setUsername(body.get("username"));
        if (body.containsKey("fullName"))   user.setFullName(body.get("fullName"));
        if (body.containsKey("department")) user.setDepartment(body.get("department"));
        if (body.containsKey("phone"))      user.setPhone(body.get("phone"));
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file,
                                          Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName()).orElseThrow();
            String url = storageService.uploadAvatar(file);
            user.setProfilePictureUrl(url);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }
}