package com.keena.capstonemvp.controller;

import com.keena.capstonemvp.dto.ProjectDto;
import com.keena.capstonemvp.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProjectController {

    @Autowired
    ProjectService projectService;

    @PostMapping("/api/project")
    public ResponseEntity<?> generateProject(@RequestBody ProjectDto projectDto) {
        try {
            projectService.createProject(projectDto);
            return new ResponseEntity<>("Project successfully created", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Project not created. Probably one or more of the submitted photos was not found. Try again.",
                    HttpStatus.BAD_REQUEST);
        }
    }
}
