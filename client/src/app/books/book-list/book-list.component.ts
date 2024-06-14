import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../_services/book.service';
import { Book } from '../../_models/book';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BookCreateModalComponent } from '../book-create-modal/book-create-modal.component';
import { BookEditModalComponent } from '../book-edit-modal/book-edit-modal.component';
import { BookDeleteModalComponent } from '../book-delete-modal/book-delete-modal.component';
import { BookTrackerService } from 'src/app/_services/booktracker.service';
import { Pagination } from 'src/app/_models/pagination';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  bsModalRef!: BsModalRef;
  pagination: Pagination | undefined;
  pagedNumber = 1;
  pageSize = 5;
  isFilterActive = false; // Track the filter state

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private toastr: ToastrService,
    public accountService: AccountService,
    private modalService: BsModalService,
    private bookTrackerService: BookTrackerService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.books = data['books'];  // Use 'books' as defined in the route resolver
      }
    });

    this.loadBooks(); // Load initial set of books
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: books => {
        this.books = books;
        console.log('Books loaded:', books); // Log the books
      },
      error: error => {
        this.toastr.error(error.error);
        console.error('Failed to load books:', error); // Log the error
      }
    });
  }

  loadBooksPaginated() {
    this.bookService.getBooksPaginated(this.pagedNumber, this.pageSize).subscribe({
      next: response => {
        if (response.result && response.pagination) {
          this.books = response.result;
          this.pagination = response.pagination;
        }
      },
      error: error => {
        this.toastr.error(error.error);
        console.error('Failed to load paginated books:', error); // Log the error
      }
    });
  }

  loadBooksPastMonth() {
    this.bookService.getBooksPastMonth().subscribe({
      next: books => {
        this.books = books;
        this.toastr.success('Displaying books of the past month'); // Show toastr message
        console.log('Books loaded for the past month:', books); // Log the books
      },
      error: error => {
        this.toastr.error(error.error);
        console.error('Failed to load books for the past month:', error); // Log the error
      }
    });
  }

  toggleFilter() {
    this.isFilterActive = !this.isFilterActive; // Toggle the filter state

    if (this.isFilterActive) {
      this.loadBooksPastMonth(); // Load books from the past month
    } else {
      this.loadBooks(); // Load all books
      this.toastr.success('Displaying all your books'); // Show toastr message
    }
  }

  openCreateBookModal() {
    this.bsModalRef = this.modalService.show(BookCreateModalComponent);
    this.bsModalRef.content.bookCreated.subscribe((book: Book) => {
      this.bookTrackerService.trackBookId(book.id);
      this.loadBooks();
    });
  }

  openEditBookModal(book: Book) {
    this.bsModalRef = this.modalService.show(BookEditModalComponent, { initialState: { book } });
    this.bsModalRef.content.bookEdited.subscribe(() => {
      this.bookTrackerService.trackBookId(book.id);
      this.loadBooks();
    });
  }

  openDeleteBookModal(book: Book) {
    this.bsModalRef = this.modalService.show(BookDeleteModalComponent, { initialState: { book } });
    this.bsModalRef.content.bookDeleted.subscribe(() => {
      this.loadBooks();
    });
  }

  pageChanged(page: number): void {
    this.pagedNumber = page;
    this.loadBooksPaginated();
  }
}
