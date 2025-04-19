package com.ensolvers.challenge.service;

import com.ensolvers.challenge.dto.CategoryDTO;
import com.ensolvers.challenge.entity.Category;
import com.ensolvers.challenge.entity.Note;
import com.ensolvers.challenge.mapper.CategoryMapper;
import com.ensolvers.challenge.repository.CategoryRepository;
import com.ensolvers.challenge.repository.NoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private NoteRepository noteRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void shouldCreateCategory() {
        var dto = new CategoryDTO();
        dto.setName("Test category");

        var entity = new Category();

        when(categoryMapper.toEntity(dto)).thenReturn(entity);
        when(categoryRepository.save(entity)).thenReturn(entity);
        when(categoryMapper.toDto(entity)).thenReturn(dto);

        var result = categoryService.createCategory(dto);
        assertEquals("Test category", result.getName());
    }

    @Test
    void shouldDeleteCategory() {
        Long id = 1L;
        var category = new Category();
        var note = new Note();

        when(categoryRepository.findById(id)).thenReturn(Optional.of(category));
        when(noteRepository.findByCategoriesId(id)).thenReturn(List.of(note));

        categoryService.deleteCategory(id);

        verify(categoryRepository).delete(category);
    }
}
