import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-employee-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-employee-stats.component.html',
  styleUrl: './dashboard-employee-stats.component.css'
})
export class DashboardEmployeeStatsComponent implements OnInit, AfterViewInit {
  @ViewChild('attendanceChart') attendanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('completenessChart') completenessChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('taskProgressChart') taskProgressChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('taskCompletionChart') taskCompletionChartRef!: ElementRef<HTMLCanvasElement>;

  user: any = null;
  selectedPeriod: string = '2022'; // 2022
  displayMode: 'monthly' | 'yearly' = 'yearly';

  kpiData = {
    totalWorkingDays: 237,
    actualWorkingHours: '2126 hr 14 min',
    totalWorkingHours: '2930 hr 26 min',
    totalLateComing: 0
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
  }

  ngAfterViewInit() {
    this.createAttendanceChart();
    this.createCompletenessChart();
    this.createTaskProgressChart();
    this.createTaskCompletionChart();
  }

  createAttendanceChart() {
    const ctx = this.attendanceChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Present',
            data: [22, 20, 25, 18, 20, 7, 7, 21, 19, 23, 27, 24],
            backgroundColor: '#667eea'
          },
          {
            label: 'Absent',
            data: [2, 1, 1, 2, 1, 0, 0, 1, 2, 1, 1, 1],
            backgroundColor: '#e53e3e'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 30,
            ticks: {
              stepSize: 5
            }
          }
        }
      }
    });
  }

  createCompletenessChart() {
    const ctx = this.completenessChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Complete', 'Not Complete'],
        datasets: [{
          data: [50, 50],
          backgroundColor: ['#667eea', '#e53e3e']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15
            }
          }
        }
      }
    });
  }

  createTaskProgressChart() {
    const ctx = this.taskProgressChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Complete', 'In Progress'],
        datasets: [{
          data: [80, 20],
          backgroundColor: ['#667eea', '#e2e8f0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  createTaskCompletionChart() {
    const ctx = this.taskCompletionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Complete',
            data: [120, 150, 180, 160, 200, 175, 190, 210, 195, 220, 200, 180],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Created Task',
            data: [80, 100, 120, 110, 130, 125, 140, 150, 145, 160, 150, 140],
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 250
          }
        }
      }
    });
  }

  toggleDisplayMode(mode: 'monthly' | 'yearly') {
    this.displayMode = mode;
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

