import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.css'
})
export class DashboardOverviewComponent implements OnInit {
  user: any = null;
  selectedPeriod: string = '2021-11'; // November 2021
  tasks: Task[] = [
    {
      role: 'UI/UX Designer',
      title: '[Wms][Web][Task] Create Goals Design',
      attachments: 44,
      comments: 1,
      priority: 'Medium',
      dueDate: '06 Aug 2021'
    },
    {
      role: 'UI/UX Designer',
      title: '[Wms][Chat] Improve Design',
      attachments: 44,
      comments: 1,
      priority: 'Medium',
      dueDate: '06 Aug 2021'
    },
    {
      role: 'UI/UX Designer',
      title: '[Wms][Task] Improve Dashboard',
      attachments: 44,
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

  navigateToStats() {
    this.router.navigate(['/dashboard/employee-stats']);
  }

  navigateToOverview() {
    this.router.navigate(['/dashboard/overview']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

