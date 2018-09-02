import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from "../../services/user.service";
import { ValidationService } from '../../services/validation.service';
import { TokenManagerService } from "../../../../projects/token-manager/src/public_api";
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
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
    this.signupForm = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // on each value change we call the validateForm function
    // We only validate form controls that are dirty, meaning they are touched
    // the result is passed to the formErrors object
    this.signupForm.valueChanges.subscribe((data) => {
      this.formErrors = this.validationService.validateForm(this.signupForm, this.formErrors, true)
    });
  }

  // initiate component
  public ngOnInit() {
    this.buildForm();
  }

  signup(){
// mark all fields as touched
    this.validationService.markFormGroupTouched(this.signupForm);
    // right before we submit our form to the server we check if the form is valid
    // if not, we pass the form to the validateform function again. Now with check dirty false
    // this means we check every form field independent of wether it's touched
    if (this.signupForm.valid) {
      this.userService.signup(this.signupForm.controls.email.value, this.signupForm.controls.password.value)
        .subscribe(() => {
          this.userService.login(this.signupForm.controls.email.value, this.signupForm.controls.password.value).then((response) => {
            this.userService.logUserIn(response);
            this.signupForm.reset();
          })
        },
          error => {
            console.log(error);
          })
    } else {
      this.formErrors = this.validationService.validateForm(this.signupForm, this.formErrors, false)
    }
  }



}
