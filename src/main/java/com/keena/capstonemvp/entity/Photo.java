package com.keena.capstonemvp.entity;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

@Entity
@Table(name="photo")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Slf4j
public class Photo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long id;

    @Lob
    @Column(name = "content")
    private byte[] content;

    @Column(name = "is_private")
    private boolean isPrivate;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "parent_id")
    private Photo parent;

    @OneToMany(mappedBy = "parent", cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @Column(name = "children_photos")
    private Collection<Photo> children;

    @ManyToMany(mappedBy = "photos", cascade = CascadeType.PERSIST)
    @Column(name = "tags")
    private Collection<Tag> tags;

    @PreRemove
    private void removePhotosFromTags() {
        for (Tag t : tags) {
            t.getPhotos().remove(this);
        }
    }

    @ManyToOne
    @JoinColumn(name = "photo_owner")
    private User owner;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "projects_tiles",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "photo_id")
    )
    private Collection<Project> projectsAsTile;

    public Collection<Project> getProjectsAsTile() {
        if(this.projectsAsTile == null) {
            this.projectsAsTile = new ArrayList<>();
        }
        return this.projectsAsTile;
    }

    @OneToMany(mappedBy = "mainPhoto")
    @Column(name = "projects")
    private Collection<Project> projectsAsMain;

    public Collection<Project> getProjectsAsMain() {
        if(this.projectsAsMain == null) {
            this.projectsAsMain = new ArrayList<>();
        }
        return this.projectsAsMain;
    }

    public void addProjectAsTile(Project project) {
        this.projectsAsTile.add(project);
        project.getTilingPhotos().add(this);
    }

    public void addProjectAsMain(Project project) {
        this.projectsAsMain.add(project);
        project.setMainPhoto(this);
    }

    public Collection<Photo> getChildren() {
        if(children == null) {
            children = new ArrayList<>();
        }
        return children;
    }

    public Collection<Tag> getTags() {
        if(tags == null) {
            tags = new ArrayList<>();
        }
        return tags;
    }

    public void addChild(Photo photo) {
        this.getChildren().add(photo);
        photo.setParent(this);
    }

    public void addTag(Tag tag) {
        this.getTags().add(tag);
    }

    public void removeTag(Tag tag) {
        this.getTags().remove(tag);
    }

    public void removeAllTags() {
        for(Tag t : this.getTags()) {
            removeTag(t);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Photo photo = (Photo) o;
        return Objects.equals(id, photo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
