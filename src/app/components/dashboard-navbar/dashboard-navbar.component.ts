import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

// ============================================================================
// Interfaces
// ============================================================================

interface SubmissionOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface NavLink {
  label: string;
  route: string;
  isDropdown?: boolean;
}

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-navbar.component.html',
  styleUrl: './dashboard-navbar.component.css'
})
export class DashboardNavbarComponent implements OnInit, OnDestroy {
  // ============================================================================
  // Properties
  // ============================================================================

  user: any = null;
  darkMode = false;
  activeRoute: string = '';
  
  // Dropdown states
  showProfileDropdown = false;
  showSubmissionDropdown = false;
  showNavDropdown = false;

  // Navigation data
  navLinks: NavLink[] = [
    { label: 'Overview', route: '/dashboard/overview' },
    { label: 'Employee Stats', route: '/dashboard/employee-stats' },
    { label: 'Submission', route: '/dashboard/submission', isDropdown: true },
    { label: 'Task', route: '/dashboard/task' },
    { label: 'Chat', route: '/dashboard/chat' },
    { label: 'Payroll', route: '/dashboard/payroll' }
  ];

  submissionOptions: SubmissionOption[] = [
    {
      id: 'exc-attendance',
      title: 'Exc. Attendance',
      description: 'Report your special absences to get an exception',
      icon: '/dashboard/submission/icon - Exc. Attendance.svg'
    },
    {
      id: 'leave',
      title: 'Leave',
      description: 'Submit your leave request here. Don\'t forget to pay attention to the quota',
      icon: '/dashboard/submission/icon - Exc. Attendance.svg'
    },
    {
      id: 'overtime-requisition',
      title: 'Overtime Requisition',
      description: 'Submit your overtime request here. Use your overtime efficiently',
      icon: '/dashboard/submission/icon - Overtime Requisition.svg'
    },
    {
      id: 'overtime',
      title: 'Overtime',
      description: 'Report your overtime here. So that your working time is not in vain',
      icon: '/dashboard/submission/icon - Overtime.svg'
    },
    {
      id: 'claim',
      title: 'Claim',
      description: 'Submit your reimbursement here. Complete the submission file',
      icon: '/dashboard/submission/icon - Claim.svg'
    },
    {
      id: 'business-trip',
      title: 'Business Trip',
      description: 'Submit your business trip here. Complete the submission file',
      icon: '/dashboard/submission/icon - Business Trip.svg'
    },
    {
      id: 'cash-advance',
      title: 'Cash Advance',
      description: 'Submit your multilevel reimbursement here. Complete the submission file',
      icon: '/dashboard/submission/icon - Cash Advance.svg'
    },
    {
      id: 'approval',
      title: 'Approval',
      description: 'Do all the approval process for your team here',
      icon: '/dashboard/submission/Icon - Approval - 24px.svg'
    }
  ];

  private routerSubscription?: Subscription;

  // ============================================================================
  // Constructor
  // ============================================================================

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ============================================================================
  // Lifecycle Hooks
  // ============================================================================

  ngOnInit(): void {
    this.initializeUser();
    this.initializeRouteTracking();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // ============================================================================
  // Initialization Methods
  // ============================================================================

  private initializeUser(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.user = {
        fullname: 'Muhammad Iqra Djauhari',
        email: 'iqra@elabram.com',
        companyName: 'Google Indonesia',
        position: 'Senior Front-End Developer',
        employeeId: 'PT - GOO34',
        joinDate: '23 Feb 2018',
        yearsOfService: '4 Years 5 Months 2 Days'
      };
    }
  }

  private initializeRouteTracking(): void {
    this.updateActiveRoute();
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveRoute();
      });
  }

  // ============================================================================
  // Route Management
  // ============================================================================

  updateActiveRoute(): void {
    const currentUrl = this.router.url;
    this.activeRoute = currentUrl;

    // Auto-close submission dropdown when navigating away
    if (this.showSubmissionDropdown && !currentUrl.startsWith('/dashboard/submission')) {
      this.showSubmissionDropdown = false;
    }
  }

  isActive(route: string): boolean {
    if (route === '/dashboard/overview') {
      return this.activeRoute === '/dashboard/overview';
    }
    return this.activeRoute.startsWith(route);
  }

  getCurrentPageLabel(): string {
    const currentLink = this.navLinks.find(link => {
      if (link.route === '/dashboard/overview') {
        return this.activeRoute === '/dashboard/overview';
      }
      return this.activeRoute.startsWith(link.route);
    });

    return currentLink ? currentLink.label : 'Overview';
  }

  isAnyDashboardRoute(): boolean {
    return this.activeRoute.startsWith('/dashboard/');
  }

  // ============================================================================
  // Navigation Methods
  // ============================================================================

  navigateToRoute(route: string): void {
    if (route === '/dashboard/submission') {
      this.toggleSubmissionDropdown();
      this.showNavDropdown = false;
    } else if (route === '/dashboard/overview' && this.showNavDropdown) {
      this.showNavDropdown = false;
      this.router.navigate([route]);
    } else {
      this.showNavDropdown = false;
      this.router.navigate([route]);
    }
  }

  navigateToProfile(): void {
    this.showProfileDropdown = false;
    // TODO: Navigate to profile page when implemented
    console.log('Navigate to profile');
  }

  navigateToSubmission(optionId: string): void {
    this.showSubmissionDropdown = false;
    this.router.navigate([`/dashboard/submission/${optionId}`]);
  }

  // ============================================================================
  // Dropdown Toggle Methods
  // ============================================================================

  toggleNavDropdown(): void {
    this.showNavDropdown = !this.showNavDropdown;
    if (this.showNavDropdown) {
      this.showSubmissionDropdown = false;
      this.showProfileDropdown = false;
    }
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
    if (this.showProfileDropdown) {
      this.showSubmissionDropdown = false;
    }
  }

  toggleSubmissionDropdown(): void {
    this.showSubmissionDropdown = !this.showSubmissionDropdown;
    if (this.showSubmissionDropdown) {
      this.showProfileDropdown = false;
    }
  }

  // ============================================================================
  // Event Handlers
  // ============================================================================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    if (!target.closest('.profile-picture-wrapper')) {
      this.showProfileDropdown = false;
    }
    if (!target.closest('.submission-dropdown-wrapper')) {
      this.showSubmissionDropdown = false;
    }
    if (!target.closest('.nav-dropdown-wrapper')) {
      this.showNavDropdown = false;
    }
  }

  // ============================================================================
  // User Actions
  // ============================================================================

  toggleDarkMode(): void {
    // TODO: Implement dark mode toggle logic
    console.log('Dark mode:', this.darkMode);
  }

  logout(): void {
    this.showProfileDropdown = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

