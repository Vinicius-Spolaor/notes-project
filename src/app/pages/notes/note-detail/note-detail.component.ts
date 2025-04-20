import { Component, Input } from '@angular/core';
import { Note } from '../../../core/models/note.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-note-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './note-detail.component.html',
  styleUrl: './note-detail.component.scss',
})
export class NoteDetailComponent {
  @Input() note!: Note;
  @Input() isEditing!: boolean;
  @Input() allCategories!: Category[];
  
  constructor(public activeModal: NgbActiveModal) {}

  isCategorySelected(category: Category): boolean {
    return this.note.categories.some((cat) => cat.id === category.id);
  }

  toggleCategory(category: Category): void {
    const isSelected = this.isCategorySelected(category);
    if (isSelected) {
      this.note.categories = this.note.categories.filter(
        (cat) => cat.id !== category.id
      );
    } else {
      this.note.categories = [...this.note.categories, category];
    }
  }
}
