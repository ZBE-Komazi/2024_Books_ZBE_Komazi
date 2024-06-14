import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../_services/book.service';
import { Book } from '../../_models/book';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BookEditModalComponent } from '../book-edit-modal/book-edit-modal.component';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book = {} as Book;
  bsModalRef!: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.book = data['book'];  // Use 'book' as defined in the route resolver
      },
      error: error => this.toastr.error(error.error)
    });
  }

  openEditBookModal() {
    if (this.book) {
      this.bsModalRef = this.modalService.show(BookEditModalComponent, { initialState: { book: this.book } });
      this.bsModalRef.content.bookEdited.subscribe(() => {
        this.loadBook();
      });
    }
  }

  loadBook() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBook(+id).subscribe({
        next: book => this.book = book,
        error: error => this.toastr.error(error.error)
      });
    }
  }

  goBack() {
    this.router.navigate(['/books']);
  }
}
