import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from './_modules/shared.module';
import { ContactComponent } from './contact/contact.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { BookCreateComponent } from './books/book-create/book-create.component';
import { BookUpdateComponent } from './books/book-update/book-update.component';
import { BookCardComponent } from './books/book-card/book-card.component';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { BookCreateModalComponent } from './books/book-create-modal/book-create-modal.component';
import { BookEditModalComponent } from './books/book-edit-modal/book-edit-modal.component';
import { BookDeleteModalComponent } from './books/book-delete-modal/book-delete-modal.component';
import { BookArchiveComponent } from './books/book-archive/book-archive.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    ContactComponent,
    DisclaimerComponent,
    BookListComponent,
    BookDetailsComponent,
    BookCreateComponent,
    BookUpdateComponent,
    BookCardComponent,
    BookArchiveComponent,
    NotFoundComponent,
    BookCreateModalComponent,
    BookEditModalComponent,
    BookDeleteModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
