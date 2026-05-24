import { Component, inject } from '@angular/core';
import { AuthService } from '../../Core/services/auth/auth.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ChangePasswordRequest, ChangePasswordResponse } from '../../Core/models';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatSidenavContent } from "@angular/material/sidenav";

@Component({
  selector: 'pos-change-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogContent
],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
 private AuthService = inject(AuthService);
 private fb = inject(FormBuilder);
 private snackbar = inject(MatSnackBar);
 public dialogRef = inject(MatDialogRef);
 loading = false;

 form = this.fb.group({
  currentPassword: ['', Validators.required],
  newPassword: ['', [Validators.required, Validators.minLength(6)]],
  confirmNewPassword: ['', Validators.required]
 }, {
  validators: this.passwordMatchValidator
 });
passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmNewPassword = group.get('confirmNewPassword')?.value;
  return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
}

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    
    this.loading = true;
    const currentPassword = this.form.value.currentPassword!;
    const newPassword = this.form.value.newPassword!;

    this.AuthService.changePassword({ currentPassword, newPassword }).subscribe({
      next: (response: ChangePasswordResponse) =>{
        this.snackbar.open(response.message || 'Password changed successfully', 'Close', { duration: 3000 });
        this.form.reset();
      },
      error: (err) =>{
        const errorMessage = err.error?.message || 'Failed to change password. Please try again.';
        this.snackbar.open(errorMessage, 'Close', { duration: 5000 });
        console.error('Change password error:', err);
      },
      complete: () => {
        this.loading = false;
      }
    })

  }

}
