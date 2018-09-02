import {Component, OnInit} from '@angular/core';
import {Product} from '../../../models/product';
import {ProductService} from '../../../services/product.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from "../../../services/user.service";
import {ValidationService} from "../../../services/validation.service";
import {DialogComponent} from "../../dialog/dialog.component";
import { MatDialog } from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  url: string = document.location.href;
  productId: string;
  public orderForm: FormGroup;
  product: Product;
  public formErrors = {
    quantity: ''
  };

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private validationService: ValidationService,
    private form: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.productId = this.url.substring(this.url.lastIndexOf('/') + 1);
    this.getById();
  }

  // build the user edit form
  public buildForm() {
    this.orderForm = this.form.group({
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    // on each value change we call the validateForm function
    // We only validate form controls that are dirty, meaning they are touched
    // the result is passed to the formErrors object
    this.orderForm.valueChanges.subscribe((data) => {
      this.formErrors = this.validationService.validateForm(this.orderForm, this.formErrors, true)
    });
  }

  orderProduct() {
    // mark all fields as touched
    this.validationService.markFormGroupTouched(this.orderForm);
    // right before we submit our form to the server we check if the form is valid
    // if not, we pass the form to the validateform function again. Now with check dirty false
    // this means we check every form field independent of wether it's touched
    if (this.orderForm.valid) {
      this.productService.orderProduct(this.orderForm.controls.quantity.value, this.productId).subscribe(response => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '600px',
          data: {
            content: 'Product ordered!',
            title: 'Success'
          },
        });
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['/']);
        });
      });
    } else {
      this.formErrors = this.validationService.validateForm(this.orderForm, this.formErrors, false);
    }
  }

  getById() {
    this.productService.getById(this.productId).subscribe(response => {
      this.product = new Product(response['product']);
    });
  }
}
