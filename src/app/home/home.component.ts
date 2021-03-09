import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { User } from '../_models';

import {RegisterComponent} from '../register/register.component';
import { AlertService, UserService } from '../_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: User;
    registerForm: FormGroup;
    users: User[] = [];
    totalRows =0;
    config:any;
    skip =0;
    limit = 10;
    isUpdate =false;
    currentPageNumber =1;
    updateUserData :any;
    searchvalue:any;
    submitted:boolean;
    
    constructor(private userService: UserService ,private formBuilder: FormBuilder,
        private route: ActivatedRoute, private alertService: AlertService,
         private router: Router ) {

            this.registerForm = this.formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                username: ['', Validators.required],
                mobileNumber: ['', Validators.required],
                email: ['', Validators.required]
            });
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.config = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems:0
            };
            
    }
    get f() { return this.registerForm.controls; }
    ngOnInit() {
        this.loadAllUsers();
    }
        deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => { 
            this.loadAllUsers() 
        });
    }
    back() {
        this.isUpdate = false;
        this.updateUserData = undefined;

    }
    private loadAllUsers() {
        this.skip =0;
               this.userService.getAll(this.skip ,this.limit).pipe(first()).subscribe((data:any) => { 
            this.users = data.allUsers; 
            this.config.totalItems = data.totalusers;
            this.config = {
                currentPage: 1,
                itemsPerPage: 10,
                totalItems:data.totalusers
                };
            
        });
    }
    pageChange(newPage: number) {
        this.skip = (newPage - 1) * 10;
        this.currentPageNumber = newPage;
        if(this.searchvalue.length == 0) {
        this.userService.getAll(this.skip, this.limit).pipe(first()).subscribe((data: any) => {
            this.users = data.allUsers;
            this.config = {
                currentPage: newPage,
                itemsPerPage: 10,
                totalItems: data.totalusers
            };
        });
    }else {

        this.search(this.searchvalue, true);
    }
    }
    removeUser(user:any) {


        this.userService.delete(user._id).pipe(first()).subscribe((data:any) => { 
        if (data) {
            this.userService.getAll(this.skip, this.limit).pipe(first()).subscribe((data: any) => {
                this.users = data.allUsers;
                this.config = {
                    currentPage: this.currentPageNumber,
                    itemsPerPage: 10,
                    totalItems: data.totalusers
                };
            });
            this.alertService.success(user.firstName +" is removed successfully.", true);
                   
            
        }
        });
       

    }
    updateUser(user: any) {
        this.isUpdate = true;
        this.updateUserData = user;
        this.registerForm.controls['firstName'].setValue(this.updateUserData.firstName);
        this.registerForm.controls['lastName'].setValue(this.updateUserData.lastName);
        this.registerForm.controls['email'].setValue(this.updateUserData.email);
        this.registerForm.controls['mobileNumber'].setValue(this.updateUserData.mobileNumber);
        this.registerForm.controls['username'].setValue(this.updateUserData.username);
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
       
        let dataObject = this.registerForm.value;
        dataObject["Id"]= this.updateUserData._id;
        this.userService.update(dataObject).pipe(first()).subscribe((data: any) => {
             });
        this.alertService.success("User is updated successfully.", true);

    }
    onComplete() {
        this.router.navigate(['/']);

            }
    createUser(user:any) {
        this.router.navigate(['/create']);
            }

     search(key , isFromPagination) {
         if(!isFromPagination) {
         this.skip =0;
         }
         this.currentPageNumber = 1;
         this.searchvalue = key;
        this.userService.search({key : key, skip: this.skip}).pipe(first()).subscribe((data: any) => {
            this.users = data.allUsers;
            this.config = {
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: data.totalusers
            };
        });

     }
}