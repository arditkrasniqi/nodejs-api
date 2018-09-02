import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from "../../../services/user.service";
import { ProductService } from "../../../services/product.service";
import { ValidationService } from '../../../services/validation.service';
import { TokenManagerService } from "../../../../../projects/token-manager/src/public_api";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-create-product',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateProductComponent implements OnInit {
  public productImageEl;
  public productFileName = false;
  public createForm: FormGroup;
  public formErrors = {
    name: '',
    price: '',
    productImage: '',
    description: ''
  };
  constructor(
    private userService: UserService,
    private validationService: ValidationService,
    private form: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private dialog: MatDialog
  ) { }

  // build the user edit form
  public buildForm() {
    this.createForm = this.form.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required]],
      productImage: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    // on each value change we call the validateForm function
    // We only validate form controls that are dirty, meaning they are touched
    // the result is passed to the formErrors object
    this.createForm.valueChanges.subscribe((data) => {
      this.formErrors = this.validationService.validateForm(this.createForm, this.formErrors, true)
    });
  }

  // initiate component
  public ngOnInit() {
    this.buildForm();
    this.productImageEl = document.getElementById('productImage');
  }

  openProductImageFile() {
    this.productImageEl.click();
  }

  productImageOnChange() {
    this.productFileName = this.productImageEl.files[0].name;
  }

  createProduct() {
    // mark all fields as touched
    this.validationService.markFormGroupTouched(this.createForm);
    // right before we submit our form to the server we check if the form is valid
    // if not, we pass the form to the validateform function again. Now with check dirty false
    // this means we check every form field independent of wether it's touched
    if (this.createForm.valid) {
      const fd = new FormData();
      fd.append('productImage', this.productImageEl.files[0]);
      fd.append('name', this.createForm.controls.name.value);
      fd.append('price', this.createForm.controls.price.value);
      fd.append('description', this.createForm.controls.description.value);
      this.productService.createProduct(fd).subscribe(response => {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '600px',
          data: {
            content: 'Product created successfully!',
            title: 'Success'
          },
        });
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['products']);
        });
      });
    } else {
      this.formErrors = this.validationService.validateForm(this.createForm, this.formErrors, false)
    }
  }
}
