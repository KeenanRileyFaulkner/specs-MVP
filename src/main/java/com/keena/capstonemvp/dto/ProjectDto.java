package com.keena.capstonemvp.dto;

import lombok.Data;

@Data
public class ProjectDto {
    private Long mainPhoto;
    private Long[] tilePhotos;
    private String projectTitle;
    private Long userId;
}
