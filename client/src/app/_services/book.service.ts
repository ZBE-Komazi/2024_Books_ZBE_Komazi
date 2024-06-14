import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../_models/book';
import { AccountService } from './account.service';
import { PaginatedResult } from '../_models/pagination';
import { of, map, take, Observable } from 'rxjs';
import { BookTrackerService } from './booktracker.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  baseUrl = 'https://localhost:5001/api';
  paginatedResult: PaginatedResult<Book[]> = new PaginatedResult<Book[]>();

  constructor(private http: HttpClient, private accountService: AccountService, private bookTrackerService: BookTrackerService) { }

  getBooks() {
    return this.http.get<Book[]>(this.baseUrl + '/books');
  }

  getBooksPaginated(page?: number, itemsPerPage?: number): Observable<PaginatedResult<Book[]>> {
    let params = new HttpParams();
    if (page !== undefined && itemsPerPage !== undefined) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    return this.http.get<Book[]>(this.baseUrl + '/books', { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          this.paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          this.paginatedResult.pagination = JSON.parse(pagination);
        }
        return this.paginatedResult;
      })
    );
  }

  getBook(id: number) {
    console.log('Fetching book with ID:', id);
    return this.http.get<Book>(this.baseUrl + '/books/' + id);
  }

  getBooksPastMonth() {
    console.log('Fetching books added/updated in the past month');
    return this.http.get<Book[]>(this.baseUrl + '/books/pastmonth');
  }

  getBooksByIds(ids: number[]) {
    return this.http.post<Book[]>(`${this.baseUrl}/books/ids`, { ids });
  }

  addBook(book: Book) {
    console.log('Adding book:', book);
    return this.http.post<Book>(this.baseUrl + '/books', book, { headers: this.accountService.getHeaders() }).pipe(
      map(newBook => {
        this.bookTrackerService.trackBookId(newBook.id);
        return newBook;
      })
    );
  }

  updateBook(id: number, book: Book) {
    console.log('Updating book with ID:', id);
    return this.http.put<void>(`${this.baseUrl}/books/${id}`, book, { headers: this.accountService.getHeaders() }).pipe(
      map(() => {
        this.bookTrackerService.trackBookId(id);
      })
    );
  }

  deleteBook(id: number) {
    console.log('Deleting book with ID:', id);
    return this.http.delete<void>(this.baseUrl + '/books/' + id, { headers: this.accountService.getHeaders() });
  }

  markAsRead(book: Book) {
    console.log('Marking book as read with ID:', book.id);
    return this.http.patch<void>(`${this.baseUrl}/books/${book.id}/markAsRead`, {}, { headers: this.accountService.getHeaders() }).pipe(
      map(() => {
        this.bookTrackerService.trackBookId(book.id);
      })
    );
  }
}
