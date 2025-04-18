package com.ensolvers.challenge.mapper;

import com.ensolvers.challenge.dto.CategoryDTO;
import com.ensolvers.challenge.dto.NoteDTO;
import com.ensolvers.challenge.entity.Category;
import com.ensolvers.challenge.entity.Note;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "notes", source = "notes")
    CategoryDTO toDto(Category category);

    @Mapping(target = "notes", source = "notes")
    List<CategoryDTO> toDtoList(List<Category> categories);

    Category toEntity(CategoryDTO categoryDTO);

    List<Category> toEntityList(List<CategoryDTO> categoriesDTO);

    default List<NoteDTO> mapNoteDTO(Set<Note> note) {
        if (note == null){
            return new ArrayList<>();
        }

        return note.stream()
                .map(element ->
                        NoteDTO.builder()
                            .id(element.getId())
                            .title(element.getTitle())
                            .archived(element.isArchived())
                            .content(element.getContent())
                        .build())
                .collect(Collectors.toList());
    }

}
