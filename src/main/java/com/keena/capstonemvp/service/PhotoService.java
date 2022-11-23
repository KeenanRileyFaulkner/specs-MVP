package com.keena.capstonemvp.service;

import com.keena.capstonemvp.entity.Photo;
import com.keena.capstonemvp.entity.Tag;
import com.keena.capstonemvp.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class PhotoService {
    @Autowired
    PhotoRepository photoRepository;

    public Long savePhotos(MultipartFile mainPhoto, MultipartFile[] childrenPhotos) throws Exception {
        Photo photo = new Photo();
        photo.setContent(mainPhoto.getBytes());
        photo.setPrivate(true);

        for(MultipartFile childFile : childrenPhotos) {
            Photo childPhoto = new Photo();
            childPhoto.setContent(childFile.getBytes());
            childPhoto.setPrivate(true);
            photo.addChild(childPhoto);
        }

        return photoRepository.saveAndFlush(photo).getId();
    }

    public Long savePhotos(MultipartFile mainPhoto) throws Exception {
        Photo photo = new Photo();
        photo.setContent(mainPhoto.getBytes());
        photo.setPrivate(true);

        return photoRepository.saveAndFlush(photo).getId();
    }

    public byte[] retrievePhoto(Long photoId) {
        return photoRepository.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)).getContent();
    }

    public void removePhotos(Long photoId) {

        photoRepository.findById(photoId)
                .map(photo -> {
                    photo.setParent(null);
                    return photoRepository.save(photo);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        photoRepository.deleteById(photoId);
    }

    public boolean updatePhotoPrivacy(Long photoId) {
        Photo oldPhoto = photoRepository.findById(photoId)
                .map(photo -> {
                    boolean newPrivate = !photo.isPrivate();
                    photo.setPrivate(newPrivate);
                    return photoRepository.save(photo);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return oldPhoto.isPrivate();
    }

    public Long addChildToParent(Long parentId, MultipartFile childPhoto) throws Exception{
        Photo child = new Photo();
        child.setContent(childPhoto.getBytes());
        child.setPrivate(true);

        Photo parent = photoRepository.findById(parentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        parent.addChild(child);

        return photoRepository.saveAndFlush(child).getId();
    }

    public Photo getPhotoById(Long id) throws Exception {
        Photo toReturn = photoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return toReturn;
    }

    public Collection<String> getTags(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Collection<String> toReturn = new ArrayList<>();
        for(Tag t : photo.getTags()) {
            toReturn.add(t.getName());
        }
        return toReturn;
    }
}
