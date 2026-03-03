import { Component, inject } from '@angular/core';
import { UserRegisterService } from '../../services/user-register.service';
import { addStaffRequestDto } from '../../Models/register.models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from "@angular/material/select";
import { UserRole } from '../../../../Core/models';

@Component({
  selector: 'pos-user-register',
  imports: [MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSelect, MatOption],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss'
})
export class UserRegisterComponent {
  // inject the user register service
  private userRegisterService = inject(UserRegisterService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef)
  // for use in html file
  userRoles = UserRole;

  userForm : FormGroup;
  constructor(){
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['',Validators.required, Validators.minLength(6)],
      fullName: ['',Validators.required],
      branchId:['',Validators.required],
      role: ['',Validators.required],
    });
  }
  onSubmit(userData: addStaffRequestDto): void {
    if(this.userForm.valid){
      this.userRegisterService.registerUser(userData).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          // You can add additional logic here, such as navigating to a different page or showing a success message
        },
        error: (error) => {
          console.error('Error registering user:', error);
          // Handle the error, such as showing an error message to the user
        }
      });
    }
  }

}
