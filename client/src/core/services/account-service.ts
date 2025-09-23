import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../types/user';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient); // inject HttpClient
  currentUser = signal<User | null>(null);

  baseUrl = 'https://localhost:5001/api/';

  login(creds: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
      tap(user => {
        if (user) {
          this.currentUser.set(user);
        }
      })
    )
  }

  logout() {
    this.currentUser.set(null);
  }
}
