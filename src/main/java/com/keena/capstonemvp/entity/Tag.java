package com.keena.capstonemvp.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Table(name = "tag")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
//@NamedQuery(name="findByTagName", query="SELECT t FROM Tag t WHERE t.name = ?1")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag_name")
    private String name;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "photos_tags",
            joinColumns = @JoinColumn(name = "tag_id"),
            inverseJoinColumns = @JoinColumn(name = "photo_id")
    )
    private Collection<Photo> photos;

    public Collection<Photo> getPhotos() {
        if(photos == null) {
            photos = new ArrayList<>();
        }
        return photos;
    }

    public void addPhoto(Photo photo) {
        this.getPhotos().add(photo);
        photo.addTag(this);
    }

    public void removePhoto(Photo photo) {
        this.getPhotos().remove(photo);
        photo.removeTag(this);
    }
}
