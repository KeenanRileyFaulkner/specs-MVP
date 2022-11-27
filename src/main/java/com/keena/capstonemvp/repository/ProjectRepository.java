package com.keena.capstonemvp.repository;

import com.keena.capstonemvp.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
