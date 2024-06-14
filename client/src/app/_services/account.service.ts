import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  login(model: any) {
    console.log('Attempting to log in with model:', model);

    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          console.log('Login successful, user:', user);
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        } else {
          console.log('Login failed, no user returned');
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          console.log('Registration successful, user:', user);
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    console.log('Setting current user:', user);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    console.log('Logging out');
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getHeaders() {
    const user = this.currentUserSource.value;
    console.log('Retrieving headers for user:', user);
    return {
      Authorization: `Bearer ${user?.token}`
    };
  }
}
