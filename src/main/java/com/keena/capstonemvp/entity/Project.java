package com.keena.capstonemvp.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "project")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long id;

    @JoinColumn(name = "main_photo")
    @ManyToOne(cascade = CascadeType.PERSIST)
    private Photo mainPhoto;

    @ManyToMany(mappedBy = "projectsAsTile", cascade = CascadeType.PERSIST)
    @Column(name = "tiling_photos")
    private Collection<Photo> tilingPhotos;

    public void addTilePhoto(Photo photo) {
        this.getTilingPhotos().add(photo);
        photo.getProjectsAsTile().add(this);
    }

    @PreRemove
    private void removeProjectsFromPhotos() {
        for(Photo p : tilingPhotos) {
            p.getProjectsAsTile().remove(this);
        }
    }

    public Collection<Photo> getTilingPhotos() {
        if(this.tilingPhotos == null) {
            this.tilingPhotos = new ArrayList<>();
        }
        return this.tilingPhotos;
    }

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "project_owner")
    private User projectOwner;

    @Column(name = "project_name")
    private String projectName;
}
