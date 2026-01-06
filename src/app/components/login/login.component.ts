import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.submitted = false;
    this.loginForm.reset({
      email: '',
      password: '',
      rememberMe: false
    });
  
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsPristine();
      control.markAsUntouched();
    });
  
    // Redirect to dashboard if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/overview']);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Mark all fields as touched to show validation errors
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (this.authService.login(email, password)) {
        this.router.navigate(['/dashboard/overview']);
      } else {
        if (
          confirm(
            "Invalid email or password.\n\nClick OK to register a new account, or Cancel to try again."
          )
        ) {
          window.location.href = "/registration";
        }
      }
    }
  }

  onSocialLogin(provider: string): void {
    alert(`Social login with ${provider} is not implemented (UI only)`);
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors && (field.touched || this.submitted)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Password'
    };
    return labels[fieldName] || fieldName;
  }
}

