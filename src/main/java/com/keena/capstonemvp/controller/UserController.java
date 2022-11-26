package com.keena.capstonemvp.controller;

import com.keena.capstonemvp.entity.Photo;
import com.keena.capstonemvp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping(value = "/api/user/{userId}/photos")
    Collection<Photo> getAllPhotos(@PathVariable Long userId) throws Exception {
        return userService.getUserPhotos(userId);
    }

    @PostMapping(value = "/api/user/creation")
    Long createUser(@RequestParam("username") String username) throws Exception {
        return userService.createUser(username);
    }
}
