package com.ensolvers.challenge.service;

import com.ensolvers.challenge.dto.NoteDTO;
import com.ensolvers.challenge.entity.Category;
import com.ensolvers.challenge.entity.Note;
import com.ensolvers.challenge.entity.User;
import com.ensolvers.challenge.exception.BusinessException;
import com.ensolvers.challenge.mapper.NoteMapper;
import com.ensolvers.challenge.repository.CategoryRepository;
import com.ensolvers.challenge.repository.NoteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class NoteService {
    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;
    private final NoteMapper noteMapper;

    public NoteService(NoteRepository noteRepository, CategoryRepository categoryRepository, NoteMapper noteMapper) {
        this.noteRepository = noteRepository;
        this.categoryRepository = categoryRepository;
        this.noteMapper = noteMapper;
    }

    @Transactional
    public NoteDTO createNote(NoteDTO noteDto, User user) {
        var note = noteMapper.toEntity(noteDto);
        note.setUser(user);

        if (note.getCategories() != null && !note.getCategories().isEmpty()) {
            note.setCategories(processNoteCategories(note.getCategories().stream().toList()));
        }

        return noteMapper.toDto(noteRepository.save(note));
    }

    public NoteDTO updateNote(Long noteId, NoteDTO updatedNoteDto, User user) {
        var updatedNote = noteMapper.toEntity(updatedNoteDto);

        var note = getNoteByIdAndUser(noteId, user);
        note.setTitle(updatedNote.getTitle());
        note.setContent(updatedNote.getContent());
        note.setCategories(updatedNote.getCategories());
        note.setArchived(updatedNote.isArchived());

        return noteMapper.toDto(noteRepository.save(note));
    }

    public void deleteNote(Long noteId, User user) {
        var note = getNoteByIdAndUser(noteId, user);
        noteRepository.delete(note);
    }

    public List<NoteDTO> getActiveNotes(User user) {
        return noteMapper.toDtoList(noteRepository.findByUserAndArchived(user, false));
    }

    public List<NoteDTO> getArchivedNotes(User user) {
        return noteMapper.toDtoList(noteRepository.findByUserAndArchived(user, true));
    }

    public NoteDTO getNoteById(Long noteId, User user) {
        return noteMapper.toDto(getNoteByIdAndUser(noteId, user));
    }

    public NoteDTO archiveNote(Long noteId, User user) {
        var note = getNoteByIdAndUser(noteId, user);
        note.setArchived(true);

        return noteMapper.toDto(noteRepository.save(note));
    }

    public NoteDTO unarchiveNote(Long noteId, User user) {
        var note = getNoteByIdAndUser(noteId, user);
        note.setArchived(false);

        return noteMapper.toDto(noteRepository.save(note));
    }

    public NoteDTO addCategoryToNote(Long noteId, String categoryName, User user) {
        var note = getNoteByIdAndUser(noteId, user);
        var category = categoryRepository.findByName(categoryName)
            .orElseGet(() -> categoryRepository.save(Category.builder().name(categoryName).build()));

        note.getCategories().add(category);
        return noteMapper.toDto(noteRepository.save(note));
    }

    public NoteDTO removeCategoryFromNote(Long noteId, String categoryName, User user) {
        var note = getNoteByIdAndUser(noteId, user);
        categoryRepository.findByName(categoryName).ifPresent(note.getCategories()::remove);

        return noteMapper.toDto(noteRepository.save(note));
    }

    public List<NoteDTO> filterNotesByCategory(String categoryName, User user) {
        var noteList = noteRepository.findAll().stream()
                .filter(note -> note.getUser().getId().equals(user.getId()))
                .filter(note -> note.getCategories().stream()
                        .anyMatch(cat -> cat.getName().equalsIgnoreCase(categoryName)))
                .toList();

        return noteMapper.toDtoList(noteList);
    }

    private Note getNoteByIdAndUser(Long id, User user) {
        return noteRepository.findById(id)
            .filter(note -> note.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new BusinessException("Note not found or does not belong to user."));
    }

    private Set<Category> processNoteCategories(List<Category> category) {
        return category.stream()
                .map(cat -> categoryRepository.findByName(cat.getName())
                        .orElseGet(() -> categoryRepository.save(Category.builder().name(cat.getName()).build())))
                .collect(Collectors.toSet());
    }
}
