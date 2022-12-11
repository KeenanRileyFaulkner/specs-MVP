package com.keena.capstonemvp.service;

import com.keena.capstonemvp.dto.ProjectDto;
import com.keena.capstonemvp.entity.Photo;
import com.keena.capstonemvp.entity.Project;
import com.keena.capstonemvp.entity.User;
import com.keena.capstonemvp.repository.PhotoRepository;
import com.keena.capstonemvp.repository.ProjectRepository;
import com.keena.capstonemvp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class ProjectService {
    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PhotoRepository photoRepository;

    public void createProject(ProjectDto projectDto) throws Exception {
        User user = userRepository.findById(projectDto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Project project = new Project();
        project.setProjectName(projectDto.getProjectTitle());

        Collection<Photo> photoCollection = new ArrayList<>();
        for(Long id : projectDto.getTilePhotos()) {
            Photo photo = photoRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

            photoCollection.add(photo);
        }
        project.setTilingPhotos(photoCollection);

        Photo mainPhoto = photoRepository.findById(projectDto.getMainPhoto())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        project.setMainPhoto(mainPhoto);

        projectRepository.saveAndFlush(project);
    }
}
