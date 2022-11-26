package com.keena.capstonemvp.service;

import com.keena.capstonemvp.entity.Photo;
import com.keena.capstonemvp.entity.User;
import com.keena.capstonemvp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;
    public Collection<Photo> getUserPhotos(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return user.getPhotos();
    }

    public Long createUser(String username) {
        User user = new User();
        user.setUsername(username);
        return userRepository.saveAndFlush(user).getId();
    }
}
