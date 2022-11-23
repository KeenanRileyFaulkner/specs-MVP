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
    private Long id;

    @Column(name="usr_name")
    private String username;

    @Column(name = "pswd")
    private String password;

    @Column(name = "user_photos")
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
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


}
