package com.keena.capstonemvp.controller;

import com.keena.capstonemvp.entity.Tag;
import com.keena.capstonemvp.service.PhotoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;

@RestController
@Slf4j
public class PhotoController {
    @Autowired
    PhotoService photoService;

    //upload a mainPhoto and all childrenPhotos
    @PostMapping(value = "/api/photos")
    Long uploadPhoto(@RequestParam("mainPhoto")MultipartFile mainPhoto,
                     @RequestParam(value = "children_photos", required = false) MultipartFile[] childrenPhotos
    ) throws Exception {
        if (childrenPhotos != null) {
            return photoService.savePhotos(mainPhoto, childrenPhotos);
        } else {
            return photoService.savePhotos(mainPhoto);
        }
    }

    //get a specific photo as a jpeg image, from its id
    @GetMapping(value = "/api/photos/{photoId}", produces = MediaType.IMAGE_JPEG_VALUE)
    Resource getPhoto(@PathVariable Long photoId) {
        return new ByteArrayResource(photoService.retrievePhoto(photoId));
    }

    //remove a photo
    @DeleteMapping(value = "/api/photos/{photoId}")
    ResponseEntity<?> deletePhoto(@PathVariable Long photoId) {
        photoService.removePhotos(photoId);
        return ResponseEntity.noContent().build();
    }

    //update privacy of a photo
    @PutMapping(value = "/api/photos/{photoId}")
    boolean updatePrivateSetting(@PathVariable Long photoId) {
        return photoService.updatePhotoPrivacy(photoId);
    }

    //add a child photo to a given photo
    @PostMapping(value = "/api/photos/{parentId}")
    Long appendChildPhoto(
            @PathVariable Long parentId, @RequestParam("childPhoto") MultipartFile childPhoto
    ) throws Exception {
        return photoService.addChildToParent(parentId, childPhoto);
    }

    //get all the tags associated with a given photo
    @GetMapping(value = "/api/photos/{photoId}/tags")
    Collection<String> getTags(@PathVariable Long photoId) throws Exception {
        return photoService.getTags(photoId);
    }
}
