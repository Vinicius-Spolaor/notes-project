package com.ensolvers.challenge.service;

import com.ensolvers.challenge.dto.NoteDTO;
import com.ensolvers.challenge.entity.Note;
import com.ensolvers.challenge.entity.User;
import com.ensolvers.challenge.mapper.NoteMapper;
import com.ensolvers.challenge.repository.CategoryRepository;
import com.ensolvers.challenge.repository.NoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class NoteServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private NoteMapper noteMapper;

    @InjectMocks
    private NoteService noteService;

    @Test
    void shouldReturnNotesByUser() {
        var user = new User();
        user.setId(1L);

        var note1 = Note.builder().id(1L).title("Title 1").content("Content 1").archived(false).user(user).build();
        var note2 = Note.builder().id(2L).title("Title 2").content("Content 2").archived(false).user(user).build();

        var note1Dto = NoteDTO.builder().id(1L).title("Title 1").content("Content 1").archived(false).build();
        var note2Dto = NoteDTO.builder().id(2L).title("Title 2").content("Content 2").archived(false).build();

        when(noteRepository.findByUserAndArchived(user, false)).thenReturn(List.of(note1, note2));
        when(noteMapper.toDtoList(List.of(note1, note2))).thenReturn(List.of(note1Dto, note2Dto));

        var result = noteService.getActiveNotes(user);

        assertEquals(2, result.size());
        verify(noteRepository, times(1)).findByUserAndArchived(user, false);
    }

    @Test
    void shouldReturnNoteById() {
        var user = new User();
        user.setId(1L);

        var note = Note.builder().id(1L).title("Title").content("Content").archived(false).user(user).build();
        when(noteRepository.findById(1L)).thenReturn(Optional.of(note));

        var noteDto = NoteDTO.builder().id(1L).title("Title").content("Content").archived(false).build();
        when(noteMapper.toDto(note)).thenReturn(noteDto);

        var result = noteService.getNoteById(1L, user);
        assertEquals("Title", result.getTitle());
    }

    @Test
    void shouldReturnActiveNotes() {
        var user = new User();
        var note = new Note();
        var noteDTO = new NoteDTO();
        var notes = List.of(note);
        var noteDTOs = List.of(noteDTO);

        when(noteRepository.findByUserAndArchived(user, false)).thenReturn(notes);
        when(noteMapper.toDtoList(notes)).thenReturn(noteDTOs);

        var result = noteService.getActiveNotes(user);

        assertEquals(1, result.size());
    }

    @Test
    void shouldCreateNote() {
        var user = new User();
        var noteDTO = new NoteDTO();
        noteDTO.setTitle("New test note");

        var note = new Note();

        when(noteMapper.toEntity(noteDTO)).thenReturn(note);
        when(noteRepository.save(any(Note.class))).thenReturn(note);
        when(noteMapper.toDto(note)).thenReturn(noteDTO);

        var result = noteService.createNote(noteDTO, user);
        assertEquals("New test note", result.getTitle());
    }
}
