import { ResolveFn } from '@angular/router';
import { BookService } from '../_services/book.service';
import { Book } from '../_models/book';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export const bookDetailResolver: ResolveFn<Book> = (route, state) => {
  const booksService = inject(BookService);
  const id = route.paramMap.get('id')!;
  return booksService.getBook(Number(id));
};

export const booksResolver: ResolveFn<Book[]> = (route, state) => {
  const booksService = inject(BookService);
  return booksService.getBooks();
};