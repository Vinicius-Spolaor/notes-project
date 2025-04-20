import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Note } from '../../core/models/note.model';
import { NotesService } from '../../core/services/notes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category.model';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../core/services/category.service';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { LoadingService } from '../../core/services/loading.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-notes',
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotesComponent implements OnInit, OnDestroy {
  activeNotes: Note[] = [];
  archivedNotes: Note[] = [];
  currentNotes$ = new BehaviorSubject<Note[]>([]);
  categories: Category[] = [];
  selectedCategory: string = '';
  filterText: string = '';
  showArchived = false;
  private ngUnsubscribe = new Subject<void>();
  selectedNote: Note | null = null;
  isEditing = false;

  constructor(
    private noteService: NotesService,
    private categoryService: CategoryService,
    private router: Router,
    private modalService: NgbModal,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadData();
    }, 10);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(): void {
    this.loadingService.show();
    Promise.all([this.loadActiveNotesPromise(), this.loadCategoriesPromise()])
      .then(() => {
        this.updateDisplayedNotes();
        this.loadingService.hide();
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.loadingService.hide();
      });
  }

  loadArchivedData(): void {
    this.loadingService.show();
    Promise.all([this.loadArchivedNotesPromise(), this.loadCategoriesPromise()])
      .then(() => {
        this.updateDisplayedNotes();
        this.loadingService.hide();
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.loadingService.hide();
      });
  }

  loadActiveNotesPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.noteService
        .getActiveNotes()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (notes) => {
            this.activeNotes = notes;
            this.cdr.detectChanges();
            resolve();
          },
          error: (error) => {
            console.error('Error loading active notes:', error);
            reject(error);
          },
        });
    });
  }

  loadCategoriesPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categoryService
        .getAllCategories()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (categories) => {
            this.categories = categories;
            this.cdr.detectChanges();
            resolve();
          },
          error: (error) => {
            console.error('Error loading categories:', error);
            reject(error);
          },
        });
    });
  }

  loadArchivedNotesPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.noteService
        .getArchivedNotes()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (notes) => {
            this.archivedNotes = notes;
            this.cdr.detectChanges();
            resolve();
          },
          error: (error) => {
            console.error('Error loading active notes:', error);
            reject(error);
          },
        });
    });
  }

  toggleArchiveView(): void {
    this.showArchived = !this.showArchived;
    if (this.showArchived) {
      this.loadArchivedData();
    } else {
      this.loadData();
    }
  }

  updateDisplayedNotes(): void {
    let currentNotes = this.showArchived
      ? [...this.archivedNotes]
      : [...this.activeNotes];

    currentNotes.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });

    this.currentNotes$.next(currentNotes);
    this.filterByCategory();
    this.cdr.detectChanges();
  }

  filterByCategory(): void {
    let currentNotes = this.showArchived
      ? [...this.archivedNotes]
      : [...this.activeNotes];

    if (this.selectedCategory === 'no-category') {
      currentNotes = currentNotes.filter((note) => note.categories.length === 0);
    } else if (this.selectedCategory) {
      currentNotes = 
        currentNotes.filter((note) =>
          note.categories.some((cat) => cat.name === this.selectedCategory)
        );
    }
    currentNotes.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
    this.currentNotes$.next(currentNotes);
    this.cdr.detectChanges();
  }

  sortNotes(): void {
    var currentNotes = this.currentNotes$.getValue();
    currentNotes.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
    this.currentNotes$.next(currentNotes);
  }

  openNoteModal(note?: Note): void {
    this.selectedNote = note
      ? { ...note }
      : { id: null, title: '', content: '', archived: false, categories: [] };
    this.isEditing = !!note;
    const modalRef = this.modalService.open(NoteDetailComponent);
    modalRef.componentInstance.note = this.selectedNote;
    modalRef.componentInstance.isEditing = this.isEditing;
    modalRef.componentInstance.allCategories = this.categories;

    modalRef.result.then(
      (result) => {
        if (result === 'save') {
          if (this.isEditing && this.selectedNote?.id) {
            this.noteService
              .update(this.selectedNote.id, this.selectedNote)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                if (this.showArchived) {
                  this.loadArchivedData();
                } else {
                  this.loadData();
                }
              });
          } else if (!this.isEditing && this.selectedNote) {
            this.noteService
              .create(this.selectedNote)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                if (this.showArchived) {
                  this.loadArchivedData();
                } else {
                  this.loadData();
                }
              });
          }
          this.selectedNote = null;
        }
        this.cdr.detectChanges();
      },
      (reason) => {
        this.selectedNote = null;
      }
    );
  }

  goToManageCategories(): void {
    this.router.navigate(['/categories']);
  }

  getCategoryNames(categories: { name: string }[]): string {
    return categories.map((category) => category.name).join(', ');
  }

  confirmDeleteNote(note: Note): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent
    );
    modalRef.componentInstance.title = 'Confirm Note Deletion';
    modalRef.componentInstance.message =
      'Are you sure you want to delete the note';
    modalRef.componentInstance.itemName = note.title;
    modalRef.componentInstance.item = note;
    modalRef.componentInstance.confirmButtonText = 'Delete';
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.deleteNote(note);
        }
      },
      (reason) => {
      }
    );
  }

  deleteNote(note: Note): void {
    this.noteService
      .delete(note.id!)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.showArchived) {
          this.loadArchivedData();
        } else {
          this.loadData();
        }
      });
  }

  confirmArchiveNote(note: Note): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent
    );
    modalRef.componentInstance.title = 'Confirm Archive Note';
    modalRef.componentInstance.message =
      'Are you sure you want to archive the note';
    modalRef.componentInstance.itemName = note.title;
    modalRef.componentInstance.item = note;
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.archiveNote(note);
        }
      },
      (reason) => {
      }
    );
  }

  confirmActivateNote(note: Note): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent
    );
    modalRef.componentInstance.title = 'Confirm Activate Note';
    modalRef.componentInstance.message =
      'Are you sure you want to activate the note';
    modalRef.componentInstance.itemName = note.title;
    modalRef.componentInstance.item = note;
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.activateNote(note);
        }
      },
      (reason) => {
      }
    );
  }

  archiveNote(note: Note): void {
    this.noteService
      .archive(note.id!)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.showArchived) {
          this.loadArchivedData();
        } else {
          this.loadData();
        }
      });
  }

  activateNote(note: Note): void {
    this.noteService
      .unarchive(note.id!)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (this.showArchived) {
          this.loadArchivedData();
        } else {
          this.loadData();
        }
      });
  }
}
