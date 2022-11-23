package com.keena.capstonemvp.service;

import com.keena.capstonemvp.entity.Photo;
import com.keena.capstonemvp.entity.Tag;
import com.keena.capstonemvp.repository.PhotoRepository;
import com.keena.capstonemvp.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TagService {
    @Autowired
    TagRepository tagRepository;

    @Autowired
    PhotoRepository photoRepository;

    public Tag createTag(String name) {
        Tag tag = new Tag();
        tag.setName(name);

        tagRepository.saveAndFlush(tag);
        return tag;
    }

    public Long appendTagToPhoto(String tagName, Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Tag tag = tagRepository.findByName(tagName);
        if(tag == null) {
            tag = createTag(tagName);
            tag.addPhoto(photo);
        } else {
            tag.addPhoto(photo);
        }
        return tagRepository.saveAndFlush(tag).getId();
    }

    public void removeTagFromPhoto(String name, Long photoId) {
        Tag tag = tagRepository.findByName(name);
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        tag.removePhoto(photo);
//        tagRepository.delete(tag);
        if(tag.getPhotos().size() == 0) {
            tagRepository.delete(tag);
        }
        photoRepository.save(photo);
    }
}
