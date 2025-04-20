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
public interface NoteMapper {

    @Mapping(target = "categories", source = "categories")
    NoteDTO toDto(Note note);

    Note toEntity(NoteDTO noteDto);
    List<NoteDTO> toDtoList(List<Note> notes);
    List<Note> toEntityList(List<NoteDTO> notesDTO);

    default List<CategoryDTO> mapCategoriesDTO(Set<Category> categories) {
        if (categories == null){
            return new ArrayList<>();
        }

        return categories.stream()
                .map(cat -> CategoryDTO.builder().id(cat.getId()).name(cat.getName()).build())
                .collect(Collectors.toList());
    }
}
