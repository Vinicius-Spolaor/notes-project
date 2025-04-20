import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private baseUrl = `${environment.backend_host}/notes`;

  constructor(private http: HttpClient) {}

  getActiveNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.baseUrl}/active`);
  }

  getArchivedNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.baseUrl}/archived`);
  }

  create(note: Note): Observable<Note> {
    return this.http.post<Note>(`${this.baseUrl}`, note);
  }

  update(id: number, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.baseUrl}/${id}`, note);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  archive(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/archive`, {});
  }

  unarchive(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/unarchive`, {});
  }

  addCategoryToNote(id: number, category: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/add-category/${category}`, {});
  }

  removeCategoryFromNote(id: number, category: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/remove-category/${category}`, {});
  }
}
