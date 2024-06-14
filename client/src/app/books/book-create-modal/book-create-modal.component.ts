import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BookService } from '../../_services/book.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-create-modal',
  templateUrl: './book-create-modal.component.html',
  styleUrls: ['./book-create-modal.component.css']
})
export class BookCreateModalComponent {
  model: any = {};

  constructor(
    public bsModalRef: BsModalRef,
    private bookService: BookService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  createBook() {
    this.bookService.addBook(this.model).subscribe({
      next: () => {
        this.toastr.success('Book created successfully');
        this.bsModalRef.hide();
        this.router.navigateByUrl('/books');
      },
      error: error => this.toastr.error(error.error)
    });
  }
}
