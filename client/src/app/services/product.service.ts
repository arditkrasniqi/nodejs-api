import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Product} from '../models/product';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  createProduct(fd: FormData) {
    return this.http.post(`${environment.API}/products`, fd);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.API}/products`);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.API}/products/id/${id}`);
  }

  orderProduct(quantity: number, productId: string) {
    const obj = {
      productId: productId,
      quantity: quantity
    };
    return this.http.post(`${environment.API}/orders`, obj);
  }
}
