import { Component, OnInit } from '@angular/core';
import { BookService } from '../../_services/book.service';
import { Book } from '../../_models/book';
import { ToastrService } from 'ngx-toastr';
import { BookTrackerService } from 'src/app/_services/booktracker.service';

@Component({
  selector: 'app-book-archive',
  templateUrl: './book-archive.component.html',
  styleUrls: ['./book-archive.component.css']
})
export class BookArchiveComponent implements OnInit {
  books: Book[] = [];
  booksPastMonthCount: number = 0;

  constructor(
    private bookService: BookService,
    private toastr: ToastrService,
    private bookTrackerService: BookTrackerService
  ) { }

  ngOnInit(): void {
    this.loadTrackedBooks();
  }

  loadTrackedBooks() {
    this.bookService.getBooksPastMonth().subscribe({
      next: books => {
        this.books = books;
        this.booksPastMonthCount = books.length;
        console.log('Tracked books loaded:', books);
      },
      error: error => {
        this.toastr.error(error.error);
        console.error('Failed to load tracked books:', error);
      }
    });
  }
}
