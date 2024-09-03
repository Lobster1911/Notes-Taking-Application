import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { Note } from '../../shared/shared.component'; // Adjust the path if necessary
import { NoteService } from '../../shared/notes.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {

  noteForm!: FormGroup;
  note: Note = new Note();
  new: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private notesService: NoteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  
  ngOnInit() {
    this.noteForm = this.formBuilder.group({
      title: '', // Initialize title form control
      body: ''   // Initialize body form control
    });
    

    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        const noteId = String(params['id']);
        this.notesService.getNoteById(noteId).subscribe((note: Note) => {
          this.note = note;
          // Update form controls with note data
          this.noteForm.patchValue({
            title: this.note.title,
            body: this.note.body
          });
        });
        this.new = false;
      } else {
        this.new = true;
      }
    });
  }

  onSubmit() {
    if (this.new) {
      this.notesService.createNote(this.noteForm.value).subscribe((newNote) => {
        this.router.navigateByUrl('/');
      });
    } else {
      // Update existing note with form data
      this.note.title = this.noteForm.value.title;
      this.note.body = this.noteForm.value.body;
  
      this.notesService.updateNote(this.note._id, this.note).subscribe(() => {
        this.router.navigateByUrl('/');
      });
    }
  }
  

  cancel() {
    this.router.navigateByUrl('/');
  }

}