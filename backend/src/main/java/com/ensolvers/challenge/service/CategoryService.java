package com.ensolvers.challenge.service;

import com.ensolvers.challenge.dto.CategoryDTO;
import com.ensolvers.challenge.exception.BusinessException;
import com.ensolvers.challenge.mapper.CategoryMapper;
import com.ensolvers.challenge.repository.CategoryRepository;
import com.ensolvers.challenge.repository.NoteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final NoteRepository noteRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, NoteRepository noteRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.noteRepository = noteRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryMapper.toDtoList(categoryRepository.findAll());
    }

    public CategoryDTO createCategory(CategoryDTO categoryDto) {
        var category = categoryMapper.toEntity(categoryDto);
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    public CategoryDTO updateCategory(Long categoryId, CategoryDTO updatedCategoryDto) {
        var updatedCategory = categoryMapper.toEntity(updatedCategoryDto);

        var category = categoryRepository.findById(categoryId).orElseThrow(() -> new BusinessException("Category not found."));
        category.setName(updatedCategory.getName());
        category.setNotes(updatedCategory.getNotes());

        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        var category = categoryRepository.findById(categoryId).orElseThrow(() -> new BusinessException("Category not found."));
        var notesWithCategory = noteRepository.findByCategoriesId(categoryId);

        notesWithCategory.forEach(note -> note.getCategories().remove(category));

        noteRepository.saveAll(notesWithCategory);
        categoryRepository.delete(category);
    }
}
