import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from "../../services/user.service";
import { ValidationService } from '../../services/validation.service';
import { TokenManagerService } from "../../../../projects/token-manager/src/public_api";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public formErrors = {
    email: '',
    password: '',
  };
  constructor(
    private userService: UserService,
    private validationService: ValidationService,
    private form: FormBuilder,
    private router: Router
  ) { }

  // build the user edit form
  public buildForm() {
    this.loginForm = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // on each value change we call the validateForm function
    // We only validate form controls that are dirty, meaning they are touched
    // the result is passed to the formErrors object
    this.loginForm.valueChanges.subscribe((data) => {
      this.formErrors = this.validationService.validateForm(this.loginForm, this.formErrors, true)
    });
  }

  // initiate component
  public ngOnInit() {
    this.buildForm();
  }

  login() {
    // mark all fields as touched
    this.validationService.markFormGroupTouched(this.loginForm);
    // right before we submit our form to the server we check if the form is valid
    // if not, we pass the form to the validateform function again. Now with check dirty false
    // this means we check every form field independent of wether it's touched
    if (this.loginForm.valid) {

      this.userService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value).then(response => {
        if (response.hasOwnProperty('token')) {
          this.userService.logUserIn(response);
          this.loginForm.reset();
        }
      });

    } else {
      this.formErrors = this.validationService.validateForm(this.loginForm, this.formErrors, false)
    }
  }
}
