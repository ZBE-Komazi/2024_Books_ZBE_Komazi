import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './_guards/auth.guard';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { BookCreateComponent } from './books/book-create/book-create.component';
import { BookUpdateComponent } from './books/book-update/book-update.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { bookDetailResolver, booksResolver } from './_resolvers/book-detailed.resolver';
import { BookArchiveComponent } from './books/book-archive/book-archive.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'books', component: BookListComponent, resolve: { books: booksResolver } },
      { path: 'books/:id', component: BookDetailsComponent, resolve: { book: bookDetailResolver } },
      { path: 'book-archive', component: BookArchiveComponent },
      { path: 'books/create', component: BookCreateComponent },
      { path: 'books/update/:id', component: BookUpdateComponent }
    ]
  },
  { path: 'errors', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
