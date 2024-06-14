import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from '../../_models/book';
import { BookService } from '../../_services/book.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book: Book | undefined;
  @Output() editBookEvent = new EventEmitter<Book>();
  @Output() deleteBookEvent = new EventEmitter<Book>();

  constructor(private bookService: BookService, private toastr: ToastrService, private router: Router) { }

  handleDeleteBook() {
    if (this.book) {
      this.deleteBookEvent.emit(this.book);
    }
  }

  handleMarkAsRead() {
    if (this.book && !this.book.isRead) {
      this.bookService.markAsRead(this.book).subscribe({
        next: () => {
          this.toastr.success('Book read status updated');
          if (this.book) {
            this.book.isRead = true; // Update the local state
            this.book.date = new Date(); // Update the dateRead to the current date
          }
        },
        error: error => this.toastr.error('Failed to update book read status')
      });
    }
  }

  handleEditBook() {
    if (this.book) {
      this.editBookEvent.emit(this.book);
    }
  }

  handleViewDetails() {
    if (this.book) {
      this.router.navigate(['/books', this.book.id]);
    }
  }
}
