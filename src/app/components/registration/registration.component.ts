import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../services/auth.service';

interface Slide {
  illustration: string;
  title: string;
  subtitle: string;
  description: string;
}

interface SuccessStep {
  icon: string;
  title: string;
  description: string;
  marginLeft: number;
}

@Component({
  selector: 'app-registration',
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
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  currentSlide = 0;
  autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  registrationSuccess = false;
  submitted = false;

  slides: Slide[] = [
    {
      illustration: '/register/Illustration-1.svg',
      title: 'A few clicks away from being a part of Axdif',
      subtitle: 'Manage Task Easily & Efficiently',
      description: 'Increase employee productivity and performance in a measurable and precision system in one application.'
    },
    {
      illustration: '/register/Illustration-2.svg',
      title: 'A few clicks away from being a part of Axdif',
      subtitle: 'Employee Self-service',
      description: 'Simplify the administrative affairs of the company where you work wherever and whenever. Let\'s get started with all these conveniences'
    },
    {
      illustration: '/register/Illustration-3.svg',
      title: 'A few clicks away from being a part of Axdif',
      subtitle: 'Employee Self-service',
      description: 'Simplify the administrative affairs of the company where you work wherever and whenever. Let\'s get started with all these conveniences'
    }
  ];

  successSteps: SuccessStep[] = [
    {
      icon: '/register/img-1.svg',
      title: 'Verify your account',
      description: 'A verification link has been sent to your email account',
      marginLeft: -20
    },
    {
      icon: '/register/img-2.svg',
      title: 'Login to your account',
      description: 'Login to your Axdif account',
      marginLeft: 80
    },
    {
      icon: '/register/img-3.svg',
      title: 'Setup your data',
      description: 'Input your employee data and get the ease of managing employee',
      marginLeft: 180
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registrationForm = this.fb.group({
      companyName: ['', Validators.required],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: [''],
      phoneNumber: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      newsletter: [false],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.startAutoPlay();

    // If user is already logged in, redirect to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/overview']);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private startAutoPlay(): void {
    this.stopAutoPlay(); // Clear any existing interval
    
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
      this.cdr.markForCheck(); // Ensure change detection runs
    }, 5000); // 5 seconds interval for carousel slides
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.restartAutoPlay();
  }

  private nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  private previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  private restartAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Mark all fields as touched to show validation errors
    Object.keys(this.registrationForm.controls).forEach(key => {
      this.registrationForm.get(key)?.markAsTouched();
    });

    if (this.registrationForm.valid) {
      const formValue = this.registrationForm.value;
      this.authService.register(
        {
          companyName: formValue.companyName,
          fullname: formValue.fullname,
          email: formValue.email,
          phoneNumber: formValue.phoneNumber,
          countryCode: formValue.countryCode
        },
        formValue.password
      );
      this.registrationSuccess = true;
    }
  }

  // Helper method to check if field has error and should show error message
  hasFieldError(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    const hasFieldError = !!(field && field.invalid && (field.touched || this.submitted));
    
    // Also check for form-level password mismatch error on confirmPassword
    if (fieldName === 'confirmPassword' && this.registrationForm.errors && this.registrationForm.errors['passwordMismatch'] && (this.submitted || field?.touched)) {
      return true;
    }
    
    return hasFieldError;
  }

  // Helper method to get error message for a field
  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    
    // Check for form-level password mismatch error first
    if (fieldName === 'confirmPassword' && this.registrationForm.errors && this.registrationForm.errors['passwordMismatch'] && (this.submitted || field?.touched)) {
      return 'Passwords do not match';
    }
    
    if (field && field.errors && (field.touched || this.submitted)) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      companyName: 'Company Name',
      fullname: 'Fullname',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      terms: 'Terms & Conditions'
    };
    return labels[fieldName] || fieldName;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

