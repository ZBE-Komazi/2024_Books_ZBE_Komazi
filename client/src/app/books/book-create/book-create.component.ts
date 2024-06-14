import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../_services/book.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent {
  model: any = {};

  constructor(
    private bookService: BookService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  createBook() {
    this.bookService.addBook(this.model).subscribe({
      next: () => {
        this.toastr.success('Book created successfully');
        this.router.navigateByUrl('/books');
      },
      error: error => this.toastr.error(error.error)
    });
  }
}
