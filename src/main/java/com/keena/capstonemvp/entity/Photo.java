package com.keena.capstonemvp.entity;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

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

    @ManyToOne
    @JoinColumn(name = "photo_owner")
    private User owner;

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
}
