package com.keena.capstonemvp.service;

import com.keena.capstonemvp.entity.Photo;
import com.keena.capstonemvp.entity.User;
import com.keena.capstonemvp.repository.PhotoRepository;
import com.keena.capstonemvp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PhotoRepository photoRepository;
    public Collection<Long> getUserPhotos(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return user.getPhotos().stream().map(photo -> photo.getId()).collect(Collectors.toList());
    }

    public Long addPhoto(MultipartFile photoContent, Long userId) throws Exception{
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Photo photo = new Photo();
        photo.setContent(photoContent.getBytes());
        photo.setPrivate(true);
        photo.setOwner(user);
        user.getPhotos().add(photo);
        return photoRepository.saveAndFlush(photo).getId();
    }
}
