package com.ensolvers.challenge.repository;

import com.ensolvers.challenge.entity.Note;
import com.ensolvers.challenge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserAndArchived(User user, boolean archived);
    List<Note> findByCategoriesId(Long categoryId);
}
