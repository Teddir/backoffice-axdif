import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { AuthService } from '../../services/auth.service';
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';

interface Task {
  role: string;
  title: string;
  attachments: number;
  comments: number;
  priority: string;
  dueDate: string;
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule, DashboardNavbarComponent],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.css'
})
export class DashboardOverviewComponent implements OnInit {
  user: any = null;
  selectedPeriod: Date = new Date(2021, 10, 1); // November 2021 (month is 0-indexed)
  tasks: Task[] = [
    {
      role: 'UI/UX Designer',
      title: '[Wms][Web][Task] Create Goals Design',
      attachments: 33,
      comments: 1,
      priority: 'Medium',
      dueDate: '06 Aug 2021'
    },
    {
      role: 'UI/UX Designer',
      title: '[Wms][Chat] Improve Design',
      attachments: 33,
      comments: 1,
      priority: 'Medium',
      dueDate: '06 Aug 2021'
    },
    {
      role: 'UI/UX Designer',
      title: '[Wms][Task] Improve Dashboard',
      attachments: 33,
      comments: 1,
      priority: 'Medium',
      dueDate: '06 Aug 2021'
    }
  ];

  summaryData = {
    workingDays: '2 Hari',
    workingHours: '13 hr 14 min',
    exceptionalAttendance: '0 Hari',
    leaveTaken: '0 Hari',
    overtime: '00 hr 00 min',
    claim: 'IDR 0'
  };

  attendanceData = {
    clockIn: '07:07',
    clockOut: '18:00'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.user = {
        fullname: 'John Doe',
        companyName: 'Google Indonesia',
        position: 'Senior Front-End Developer',
        employeeId: 'PT - GOO34',
        joinDate: '23 Feb 2018',
        yearsOfService: '4 Years 5 Months 2 Days'
      };
    }
  }

  onPeriodChange(event: any): void {
    // Ensure the selectedPeriod is updated when a month is selected
    if (event && event instanceof Date) {
      this.selectedPeriod = event;
    }
  }
}

