import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
})
export class CategoryDetailComponent {
  @Input() category!: Category;
  @Input() isEditing!: boolean;
  
  constructor(public activeModal: NgbActiveModal) {}
}
