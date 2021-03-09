import { Component, OnInit, Input,OnChanges,AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService } from '../../_services';

@Component({selector: 'test',templateUrl: 'update-user.component.html'})
export class UpdateUserComponent implements OnInit ,OnChanges,AfterViewInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
      @Input ('updateUser') data:any;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { 
            this.registerForm = this.formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                username: ['', Validators.required],
                mobileNumber: ['', Validators.required],
                email: ['', Validators.required]
            });
            
            }

    ngOnInit() {
        
        this.registerForm.controls['firstName'].setValue(this.data.firstName);
       
    }
ngOnChanges(data) {
    if(data.data &&data.data.currentValue) {
    
    this.registerForm = data.data.currentValue;
    this.registerForm.controls['firstName'].setValue("sfsfsffsfsf");
  
    }
}
ngAfterViewInit() {
    if(this.data)
        this.registerForm.controls['firstName'].setValue("sfasgafasf");

    }
    

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('user created successfully', true);
                    this.registerForm.reset();
                    for (let control in this.registerForm.controls) {
                        this.registerForm.controls[control].setErrors(null);
                      }
                    this.registerForm.markAsUntouched();
                    this.registerForm.updateValueAndValidity();
                    this.loading =false;
                    
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
