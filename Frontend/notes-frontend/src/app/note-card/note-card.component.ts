import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'] // Change from styleUrl to styleUrls
})
export class NoteCardComponent implements OnInit {

  @Input('title')
  title!: string;
  @Input('body')
  body!: string;
  @Input()
  link!: string;

  @Output('delete') deleteEvent: EventEmitter<string> = new EventEmitter<string>();


  constructor() { }

  ngOnInit(): void {
  }

  onXButtonClick(){
    this.deleteEvent.emit(this.link); // Assuming `link` contains the noteId
  }
  

}
