package com.keena.capstonemvp.controller;

import com.keena.capstonemvp.entity.Photo;
import com.keena.capstonemvp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    //mapping to get all photos of a user
    @GetMapping(value = "/api/user/{userId}/photos")
    Collection<Long> getAllPhotos(@PathVariable Long userId) throws Exception {
        return userService.getUserPhotos(userId);
    }

    //mapping to add a photo to a user's photos field
    @PostMapping(value = "/api/user/{userId}/photos")
    Long addPhoto(@RequestParam("mainPhoto")MultipartFile mainPhoto,
                  @PathVariable("userId") Long userId) throws Exception {
        return userService.addPhoto(mainPhoto, userId);
    }
}
