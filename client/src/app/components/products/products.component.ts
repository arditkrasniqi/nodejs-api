import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserService } from '../../services/user.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  spinner: Boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Product[]>;
  @ViewChild(MatSort) sort: MatSort;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'price', 'userId', 'delete'];
  products: Product[];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUserProducts().subscribe(response => {
      this.products = [];
      response['result'].map(product => {
        this.products.push(new Product(product));
      });
      this.buildDataSource(this.products);
    });

  }

  private buildDataSource(data) {
    // const resp = Object.assign([], data['result']);
    this.dataSource = new MatTableDataSource<Product[]>(data);
    this.dataSource.paginator = this.paginator;
  }

  deleteProduct(id: number) {
    this.spinner = true;
    this.userService.deleteProduct(id).subscribe(response => {
      this.products = [];
      response['result'].map(product => {
        this.products.push(new Product(product));
      });
      this.buildDataSource(this.products);
      this.spinner = false;
    });
  }

}
