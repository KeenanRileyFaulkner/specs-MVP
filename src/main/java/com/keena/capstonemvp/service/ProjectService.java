package com.keena.capstonemvp.service;

import com.keena.capstonemvp.dto.ProjectCreationDto;
import com.keena.capstonemvp.dto.ProjectInformationDto;
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

    public void createProject(ProjectCreationDto projectCreationDto) throws Exception {
        User user = userRepository.findById(projectCreationDto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Project project = new Project();
        project.setProjectName(projectCreationDto.getProjectTitle());
        project.setProjectOwner(user);

        for(Long id : projectCreationDto.getTilePhotos()) {
            Photo photo = photoRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            project.addTilePhoto(photo);
        }

        Photo mainPhoto = photoRepository.findById(projectCreationDto.getMainPhoto())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        project.setMainPhoto(mainPhoto);

        projectRepository.saveAndFlush(project);
    }

    public ProjectInformationDto getProjectInformation(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        ProjectInformationDto projectInformation = new ProjectInformationDto();
        projectInformation.setNumPhotos(project.getTilingPhotos().size() + 1);
        projectInformation.setProjectTitle(project.getProjectName());

        return projectInformation;
    }
}
