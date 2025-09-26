import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css'
})
export class TestErrors {
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:5001/api/'; 
  validationErrors = signal<string[]>([]);
 
  get404Error() {
    return this.http.get<any>(this.baseUrl + 'buggy/not-found').subscribe({
      next: response => console.log(response),
      error: error => {
        console.log(error);
        this.validationErrors.set(error);
      }
    })
  }

  get400Error() {
    return this.http.get<any>(this.baseUrl + 'buggy/bad-request').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get500Error() {
    return this.http.get<any>(this.baseUrl + 'buggy/server-error').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get401Error() {
    return this.http.get<any>(this.baseUrl + 'buggy/auth').subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }

  get400ValidationError() {
    return this.http.post<any>(this.baseUrl + 'account/register', {}).subscribe({
      next: response => console.log(response),
      error: error => console.log(error)
    })
  }
}

