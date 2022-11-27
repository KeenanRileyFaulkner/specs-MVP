package com.keena.capstonemvp.entity;

import javax.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Collection;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@NamedQuery(name="selectByUsername", query="Select u FROM User u WHERE u.username = ?1")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usr_id")
    private Long id;

    @Column(name="usr_name")
    private String username;

    @Column(name = "pswd")
    private String password;

    @Column(name = "user_photos")
    @OneToMany(mappedBy = "owner", cascade = CascadeType.PERSIST)
    private Collection<Photo> photos;

    public Collection<Photo> getPhotos() {
        if(photos == null) {
            photos = new ArrayList<>();
        }
        return photos;
    }

    public void addPhoto(Photo photo) {
        this.getPhotos().add(photo);
        photo.setOwner(this);
    }

    @Column(name = "projects")
    @OneToMany(mappedBy = "projectOwner", cascade = CascadeType.PERSIST)
    private Collection<Project> projects;

    public Collection<Project> getProjects() {
        if(this.projects == null) {
            this.projects = new ArrayList<>();
        }
        return this.projects;
    }

}
