import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {
  }

  getProductOrders(productId: String): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.API}/orders/${productId}`);
  }

  markAsDone(orderId: number, productId: string, mad: boolean): Observable<Order[]> {
    return this.http.post<Order[]>(`${environment.API}/orders/mark-as-done`, {
      orderId: orderId,
      markAsDone: mad,
      productId: productId
    });
  }
}
