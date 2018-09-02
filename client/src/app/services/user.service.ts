import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TokenManagerService } from '../../../projects/token-manager/src/public_api';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) {
  }

  isAuthenticated(): boolean {
    return TokenManagerService.compareTokens();
  }

  handleError(error, reject) {
    if (error.status === 401) {
      TokenManagerService.destroy();
      this.router.navigate(['/login']);
    }
    reject(error);
  }

  login(email: string, password: string) {
    return this.http.post(`${environment.API}/users/login`, {
      email: email,
      password: password
    }).toPromise();
  }

  logUserIn(data) {
    TokenManagerService.setToken(data['token']);
    this.router.navigate(['dashboard']);
  }

  signup(email: string, password: string) {
    return this.http.post(`${environment.API}/users/signup`, {
      email: email,
      password: password
    });
  }

  logout() {
    TokenManagerService.destroy();
  }

  getUserProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API}/products/me`);
  }

  deleteProduct(productId: number): Observable<Product[]> {
    return this.http.delete<Product[]>(`${environment.API}/products/${productId}`);
  }
}
