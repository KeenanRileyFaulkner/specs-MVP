package com.keena.capstonemvp.repository;

import com.keena.capstonemvp.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Long> {

    Tag findByName(final String name);
}
