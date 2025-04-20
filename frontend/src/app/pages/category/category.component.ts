import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../core/services/loading.service';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit , OnDestroy {
  categories: Category[] = [];
  error = '';
  private ngUnsubscribe = new Subject<void>();
  isCreateCategoryModalVisible = false;
  newCategoryName = '';
  selectedCategory: Category | null = null;
  isEditing = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private modalService: NgbModal,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadCategories();
    }, 10);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadCategories(): void {
    this.loadingService.show();
    this.categoryService.getAllCategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.loadingService.hide();
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.error = 'Failed to load categories.';
          console.error('Error loading categories:', error);
          this.loadingService.hide();
          this.cdr.detectChanges();
        },
      });
  }

  openCreateCategoryModal(): void {
    this.isCreateCategoryModalVisible = true;
    this.newCategoryName = '';
  }

  closeCreateCategoryModal(): void {
    this.isCreateCategoryModalVisible = false;
  }

  createCategory(): void {
    if (this.newCategoryName.trim()) {
      this.loadingService.show();
      this.categoryService.createCategory({ name: this.newCategoryName })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (newCategory) => {
            this.categories = [...this.categories, newCategory];
            this.closeCreateCategoryModal();
            this.loadingService.hide();
            this.cdr.detectChanges();
          },
          error: (error) => {
            this.error = 'Failed to create category.';
            console.error('Error creating category:', error);
            this.loadingService.hide();
            this.cdr.detectChanges();
          },
        });
    }
  }

  deleteCategory(category: Category): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent
        );
        modalRef.componentInstance.title = 'Confirm Category Deletion';
        modalRef.componentInstance.message =
          'Are you sure you want to delete the category';
        modalRef.componentInstance.itemName = category.name;
        modalRef.componentInstance.item = category;
        modalRef.componentInstance.confirmButtonText = 'Delete';
        modalRef.result.then(
          (result) => {
            if (result === 'confirm') {
              this.confirmDeleteCategory(category.id!);
            }
          },
          (reason) => {
          }
        );
  }

  confirmDeleteCategory(id: number): void {
    this.loadingService.show();
    this.categoryService.deleteCategory(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.categories = this.categories.filter(category => category.id !== id);
          this.loadingService.hide();
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.error = 'Failed to delete category.';
          console.error('Error deleting category:', error);
          this.loadingService.hide();
          this.cdr.detectChanges();
        },
      });
  }

  openCategoryModal(category?: Category): void {
      this.selectedCategory = category
        ? { ...category }
        : { id: null, name: '' };

      this.isEditing = !!category;
      const modalRef = this.modalService.open(CategoryDetailComponent);
      modalRef.componentInstance.category = this.selectedCategory;
      modalRef.componentInstance.isEditing = this.isEditing;
  
      modalRef.result.then(
        (result) => {
          if (result === 'save') {
            if (this.isEditing && this.selectedCategory?.id) {
              this.categoryService
                .update(this.selectedCategory.id, this.selectedCategory)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(() => this.loadCategories());
            } else if (!this.isEditing && this.selectedCategory) {
              this.categoryService
                .createCategory(this.selectedCategory)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(() => this.loadCategories());
            }
            this.selectedCategory = null;
          }
          this.cdr.detectChanges();
        },
        (reason) => {
          this.selectedCategory = null;
        }
      );
    }

  navigateToNotes(): void {
    this.router.navigate(['/notes']);
  }
}