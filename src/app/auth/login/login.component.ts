import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCard, MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pos-login',
  imports: [ReactiveFormsModule, MatCard, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit(): void {
    if (this.loginForm.invalid){
      return;
    }
    this.errorMessage = null;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', err);
      }
    });
  }
}
