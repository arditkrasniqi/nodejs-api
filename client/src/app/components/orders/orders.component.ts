import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { OrderService } from "../../services/order.service";
import { Order } from "../../models/order";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  spinner: Boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Order[]>;
  @ViewChild(MatSort) sort: MatSort;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'product', 'quantity', 'date', 'markAsDone'];
  url: string = document.location.href;
  productId: string;
  orders: Order[];

  constructor(private orderService: OrderService) {
  }

  private buildDataSource(data) {
    const resp = Object.assign([], data);
    this.dataSource = new MatTableDataSource<Order[]>(resp);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.productId = this.url.substring(this.url.lastIndexOf('/') + 1);
    this.getProductOrders();
  }

  getProductOrders() {
    this.orderService.getProductOrders(this.productId).subscribe(orders => {
      this.orders = [];
      orders.map(item => {
        this.orders.push(new Order(item['_id'], item.product, item.quantity, item.createdAt, item.markAsDone));
      });
      this.buildDataSource(this.orders);
    });
  }

  markAsDone(orderId: number) {
    this.spinner = true;
    this.orderService.markAsDone(orderId, this.productId, true).subscribe(orders => {
      console.log(orders);
      this.orders = [];
      orders.map(item => {
        this.orders.push(new Order(item['_id'], item.product, item.quantity, item.createdAt, item.markAsDone));
      });
      this.buildDataSource(this.orders);
      this.spinner = false;
    });
  }

}
