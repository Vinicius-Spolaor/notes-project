import { Component } from '@angular/core';
import { LoginRequest } from '../../core/models/login-request.model';
import { AuthService } from '../../core/services/auth.service';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatInputModule, FormsModule, ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials: LoginRequest = { username: '', password: '' };
  errorMessage: string = '';
  loginForm: FormGroup;
  loading: boolean = false;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private tokenService: TokenStorageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      rememberMe: [false],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.tokenService.saveToken(response.access_token);
          this.router.navigate(['/notes']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Invalid username or password.';
          console.error('Login error:', error);
        },
      });
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
