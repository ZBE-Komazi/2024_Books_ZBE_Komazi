import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BookService } from '../../_services/book.service';
import { ToastrService } from 'ngx-toastr';
import { Book } from '../../_models/book';

@Component({
  selector: 'app-book-delete-modal',
  templateUrl: './book-delete-modal.component.html',
  styleUrls: ['./book-delete-modal.component.css']
})
export class BookDeleteModalComponent {
  @Input() book: Book | undefined;
  @Output() bookDeleted = new EventEmitter<void>();

  constructor(
    public bsModalRef: BsModalRef,
    private bookService: BookService,
    private toastr: ToastrService
  ) {}

  deleteBook() {
    if (this.book) {
      this.bookService.deleteBook(this.book.id).subscribe({
        next: () => {
          this.toastr.success('Book deleted successfully');
          this.bookDeleted.emit();
          this.bsModalRef.hide();
        },
        error: error => this.toastr.error('Failed to delete the book')
      });
    }
  }
}
