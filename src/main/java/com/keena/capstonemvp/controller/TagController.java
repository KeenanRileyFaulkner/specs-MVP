package com.keena.capstonemvp.controller;

import com.keena.capstonemvp.entity.Photo;
import com.keena.capstonemvp.entity.Tag;
import com.keena.capstonemvp.service.PhotoService;
import com.keena.capstonemvp.service.TagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;

@RestController
@Slf4j
public class TagController {
    @Autowired
    PhotoService photoService;

    @Autowired
    TagService tagService;

    @PostMapping("/api/tag/{tagName}/photo/{photoId}")
    Long appendTag(@PathVariable("tagName")String tagName, @PathVariable("photoId")Long photoId) throws Exception {
        return tagService.appendTagToPhoto(tagName, photoId);
    }

    @DeleteMapping("/api/tag/{tagName}/photo/{photoId}")
    void RemoveTag(@PathVariable("tagName")String tagName, @PathVariable("photoId")Long photoId) {
        tagService.removeTagFromPhoto(tagName, photoId);
    }
}
