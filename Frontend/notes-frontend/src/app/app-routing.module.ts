import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { NoteListComponent } from './pages/note-list/note-list.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { NoteDetailsComponent } from './pages/note-details/note-details.component'; 
import { AboutUsComponent } from './pages/about-us/about-us.component';

const routes: Routes = [
  { path: 'about-us', component: AboutUsComponent },
  { path: 'note-list', component: NoteListComponent },
  {
    path: '', component: MainLayoutComponent, 
    children: [
      { path: '', component: NoteListComponent },
      { path: 'new', component: NoteDetailsComponent },
      { path: ':id', component: NoteDetailsComponent } 
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule // Import HttpClientModule here
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
