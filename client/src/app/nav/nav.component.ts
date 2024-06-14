import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  

  constructor(public accountService: AccountService, private router: Router, 
    private toastr: ToastrService) { }


  ngOnInit(): void {
    
  }

  
  login() {
    console.log('Login initiated with model:', this.model); // Log the login attempt

    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log('Login successful:', response); // Log the successful login response
        this.router.navigateByUrl('/books');
      },
      error: error => {
        console.error('Login failed:', error); // Log the error response
        this.toastr.error(error.error);
      }
    });
  }

  logout() {
    this.accountService.logout();  
    this.router.navigateByUrl('/'); 

  }
}

