import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../_services/book.service';
import { ToastrService } from 'ngx-toastr';
import { Book } from '../../_models/book';

@Component({
  selector: 'app-book-update',
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.css']
})
export class BookUpdateComponent implements OnInit {
  model: Book | undefined;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

  }

}