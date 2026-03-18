import { Component, inject } from '@angular/core';
import { UserRegisterService } from '../../services/user-register.service';
import { addStaffRequestDto } from '../../Models/register.models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from "@angular/material/select";
import { UserRole } from '../../../../Core/models';
import { MatButton } from "@angular/material/button";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pos-user-register',
  imports: [MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatButton],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss'
})
export class UserRegisterComponent {
  // inject the user register service
  private userRegisterService = inject(UserRegisterService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef)
  private snackBar = inject(MatSnackBar);
  // for use in html file
  userRoles = UserRole;

  userForm : FormGroup;
  constructor(){
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      fullName: ['',Validators.required],
      branchId:['',Validators.required],
      role: ['',Validators.required],
    });
  }
  onSubmit(userData: addStaffRequestDto): void {
    console.log('onSubmit called with:', userData);
    if(this.userForm.valid){
      this.userRegisterService.registerUser(userData).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          this.dialogRef.close(); // Close the dialog after successful registration
          // toast or snackbar can be added here to show success message
          this.snackBar.open('User registered successfully!', 'Close', { duration: 3000 });
          // You can add additional logic here, such as navigating to a different page or showing a success message
        },
        error: (error) => {
          console.error('Error registering user:', error);
          this.snackBar.open('Error registering user!', 'Close', { duration: 3000 });
          // Handle the error, such as showing an error message to the user
        }
      });
    }
  }

}
