import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BookService } from '../../_services/book.service';
import { ToastrService } from 'ngx-toastr';
import { Book } from '../../_models/book';

@Component({
  selector: 'app-book-edit-modal',
  templateUrl: './book-edit-modal.component.html',
  styleUrls: ['./book-edit-modal.component.css']
})
export class BookEditModalComponent implements OnInit {
  book!: Book;
  @Output() bookEdited = new EventEmitter<void>();

  constructor(
    public bsModalRef: BsModalRef,
    private bookService: BookService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  updateBook() {
    this.bookService.updateBook(this.book.id, this.book).subscribe({
      next: () => {
        this.toastr.success('Book updated successfully');
        this.bookEdited.emit();
        this.bsModalRef.hide();
      },
      error: error => this.toastr.error('Failed to update the book')
    });
  }
}
