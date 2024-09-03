import { Component, OnInit } from '@angular/core';
import { Note } from '../../shared/shared.component'; // Adjust the path if necessary
import { NoteService } from '../../shared/notes.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'] // Change from styleUrl to styleUrls
})
export class NoteListComponent implements OnInit {

  notes: Note[] = []; // Initialize notes as an empty array
  filteredNotes: Note[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();
    this.filteredNotes = this.notes;
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe(
      (notes: Note[]) => {
        this.notes = notes;
      },
      (error) => {
        console.error('Error loading notes:', error);
      }
    );
  }

  NoteDelete(noteId: string): void {
    this.noteService.deleteNote(noteId).subscribe(
      () => {
        // Filter out the deleted note from the notes array
        this.notes = this.notes.filter(note => note._id !== noteId);
      },
      (error) => {
        console.error('Error deleting note:', error);
      }
    );
  }


  ///Filter

  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();
    // split up the search query into individual words
    let terms: string[] = query.split(' '); // split on spaces
    // remove duplicate search terms
    terms = this.removeDuplicates(terms);
    // compile all relevant results into the allResults array
    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term);
      // append results to the allResults array
      allResults = [...allResults, ...results]
    });

    // allResults will include duplicate notes
    // because a particular note can be the result of many search terms
    // but we don't want to show the same note multiple times on the UI
    // so we first must remove the duplicates
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    // now sort by relevancy
    this.sortByRelevancy(allResults);
  }
  

  removeDuplicates(arr: any[]): any[] {
    return Array.from(new Set(arr));
  }

  relevantNotes(query: string): Note[] {
    query = query.toLowerCase().trim();
    return this.notes.filter(note => {
      return (note.title && note.title.toLowerCase().includes(query)) ||
             (note.body && note.body.toLowerCase().includes(query));
    });
  }

  sortByRelevancy(searchResults: Note[]): Note[] {
    let noteCountObj: {[key: string]: number} = {};

    searchResults.forEach(note => {
      noteCountObj[note._id] = (noteCountObj[note._id] || 0) + 1;
    });

    return searchResults.sort((a: Note, b: Note) => {
      return (noteCountObj[b._id] || 0) - (noteCountObj[a._id] || 0);
    });
  }
}