import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from './shared.component';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private baseUrl = 'http://localhost:5000/api/notes'; // Replace with your Flask server URL

  constructor(private http: HttpClient) { }

  createNote(note: Note): Observable<any> {
    // Send only the title and body properties of the note in the request body
    const requestBody = { title: note.title, body: note.body };
    return this.http.post<any>(`${this.baseUrl}`, requestBody);
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.baseUrl}`);
  }

  getNoteById(noteId: string): Observable<Note> {
    return this.http.get<Note>(`${this.baseUrl}/${noteId}`);
  }

  updateNote(noteId: string, note: Note): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${noteId}`, note);
  }

  deleteNote(noteId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${noteId}`);
  }

  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.baseUrl}`);
  }
}
