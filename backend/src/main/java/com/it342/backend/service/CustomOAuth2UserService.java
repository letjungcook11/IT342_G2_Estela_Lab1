package com.it342.backend.service;

import com.it342.backend.model.User;
import com.it342.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email    = oAuth2User.getAttribute("email");
        String name     = oAuth2User.getAttribute("name");
        String picture  = oAuth2User.getAttribute("picture");

        Optional<User> existing = userRepository.findByEmail(email);

        if (existing.isEmpty()) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(name != null ? name : email.split("@")[0]);
            newUser.setFullName(name);
            newUser.setPassword("");
            newUser.setRole("STUDENT");
            newUser.setProfilePictureUrl(picture);
            userRepository.save(newUser);
        } else {
            User user = existing.get();
            if (picture != null && user.getProfilePictureUrl() == null) {
                user.setProfilePictureUrl(picture);
                userRepository.save(user);
            }
        }

        return oAuth2User;
    }
}