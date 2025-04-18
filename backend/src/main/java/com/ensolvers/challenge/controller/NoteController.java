package com.ensolvers.challenge.controller;

import com.ensolvers.challenge.dto.NoteDTO;
import com.ensolvers.challenge.entity.User;
import com.ensolvers.challenge.mapper.NoteMapper;
import com.ensolvers.challenge.service.NoteService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notes")
public class NoteController {
    private final NoteService noteService;
    private final NoteMapper noteMapper;

    public NoteController(NoteService noteService, NoteMapper noteMapper) {
        this.noteService = noteService;
        this.noteMapper = noteMapper;
    }

    @GetMapping("/active")
    public List<NoteDTO> getActiveNotes(@AuthenticationPrincipal User user) {
        return noteService.getActiveNotes(user);
    }

    @GetMapping("/archived")
    public List<NoteDTO> getArchivedNotes(@AuthenticationPrincipal User user) {
        return noteService.getArchivedNotes(user);
    }

    @PostMapping
    public NoteDTO createNote(@RequestBody NoteDTO note, @AuthenticationPrincipal User user) {
        return noteService.createNote(noteMapper.toEntity(note), user);
    }

    @PutMapping("/{id}")
    public NoteDTO updateNote(@PathVariable Long id, @RequestBody NoteDTO note, @AuthenticationPrincipal User user) {
        return noteService.updateNote(id, noteMapper.toEntity(note), user);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id, @AuthenticationPrincipal User user) {
        noteService.deleteNote(id, user);
    }

    @PatchMapping("/{id}/archive")
    public NoteDTO archiveNote(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return noteService.archiveNote(id, user);
    }

    @PatchMapping("/{id}/unarchive")
    public NoteDTO unarchiveNote(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return noteService.unarchiveNote(id, user);
    }

    @PatchMapping("/{id}/add-category/{category}")
    public NoteDTO addCategory(@PathVariable Long id, @PathVariable String category, @AuthenticationPrincipal User user) {
        return noteService.addCategoryToNote(id, category, user);
    }

    @PatchMapping("/{id}/remove-category/{category}")
    public NoteDTO removeCategory(@PathVariable Long id, @PathVariable String category, @AuthenticationPrincipal User user) {
        return noteService.removeCategoryFromNote(id, category, user);
    }

    @GetMapping("/filter/{category}")
    public List<NoteDTO> filterByCategory(@PathVariable String category, @AuthenticationPrincipal User user) {
        return noteService.filterNotesByCategory(category, user);
    }
}
