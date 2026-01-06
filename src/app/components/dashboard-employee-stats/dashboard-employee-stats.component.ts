import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';
import { BadgeModule } from "primeng/badge";

@Component({
  selector: 'app-dashboard-employee-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardNavbarComponent, ChartModule, DatePickerModule, BadgeModule],
  templateUrl: './dashboard-employee-stats.component.html',
  styleUrl: './dashboard-employee-stats.component.css'
})
export class DashboardEmployeeStatsComponent implements OnInit {

  user: any = null;
  selectedPeriod: Date = new Date(2022, 0, 1); // January 2022
  displayMode: 'monthly' | 'yearly' = 'yearly';

  kpiData = {
    totalWorkingDays: 237,
    actualWorkingHours: '2126 hr 14 min',
    totalWorkingHours: '2930 hr 26 min',
    totalLateComing: 0
  };

  isMobile = false;
  chartWidth: number = 0;

  // Attendance Summary Chart Data
  attendanceChartData: any;
  attendanceChartOptions: any;
  attendanceChartOptions1: any; // Mobile: Y-axis only
  attendanceChartOptions2: any; // Mobile: Chart data only

  // Attendance Completeness Chart Data
  completenessChartData: any;
  completenessChartOptions: any;

  // Overall Task Progress Chart Data
  progressChartData: any;
  progressChartOptions: any;

  // Task Completion Chart Data
  taskCompletionChartData: any;
  taskCompletionChartOptions: any;
  taskCompletionChartData1: any; // Mobile: Y-axis only
  taskCompletionChartOptions1: any; // Mobile: Y-axis only
  taskCompletionChartOptions2: any; // Mobile: Chart data only

  // Task Completion KPI Data
  taskKpiData = {
    totalTaskCompleted: 2400,
    totalTaskCompletedTrend: '20%',
    totalTaskCompletedLastYear: 2000,
    mostCompletedTasksAt: 185,
    mostCompletedTasksAtMonth: 'May 2022',
    totalTaskCreated: 1600,
    totalTaskCreatedTrend: '20%',
    totalTaskCreatedLastYear: 1800,
    mostCompletedTaskType: 'UI/UX Design',
    mostCompletedTaskTypeCount: 240
  };

  // Leave Recap Data
  leaveRecapData: any[] = [
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 02 Jan 2023',
      leaveType: 'Annual Leave',
      startDate: 'Tue, 03 Jan 2023',
      endDate: 'Tue, 03 Jan 2023',
      duration: '1 Day(s)',
      day: 'Half Day - First Half',
      status: 'Approve',
      reason: 'Personal Reason'
    },
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 09 Jan 2023',
      leaveType: 'Compassionate Leave (Imm. Family)',
      startDate: 'Tue, 10 Jan 2023',
      endDate: 'Wed, 11 Jan 2023',
      duration: '2 Day(s)',
      day: 'Full',
      status: 'Approve',
      reason: 'Personal Reason'
    },
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 16 Jan 2023',
      leaveType: 'Annual Leave',
      startDate: 'Tue, 24 Jan 2023',
      endDate: 'Tue, 24 Jan 2023',
      duration: '0.5 Day(s)',
      day: 'Half Day - Second Half',
      status: 'Approve',
      reason: 'Personal Reason'
    },
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 23 Jan 2023',
      leaveType: 'Annual Leave',
      startDate: 'Fri, 27 Jan 2023',
      endDate: 'Fri, 27 Jan 2023',
      duration: '0.5 Day(s)',
      day: 'Half Day - First Half',
      status: 'Approve',
      reason: 'Personal Reason'
    },
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 30 Jan 2023',
      leaveType: 'Sick Leave',
      startDate: 'Mon, 30 Jan 2023',
      endDate: 'Wed, 01 Feb 2023',
      duration: '3 Day(s)',
      day: 'Full',
      status: 'Approve',
      reason: 'Personal Reason'
    },
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 30 Jan 2023',
      leaveType: 'Sick Leave',
      startDate: 'Mon, 30 Jan 2023',
      endDate: 'Wed, 01 Feb 2023',
      duration: '3 Day(s)',
      day: 'Half Day - Second Half',
      status: 'Approve',
      reason: 'Personal Reason'
    },
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 30 Jan 2023',
      leaveType: 'Sick Leave',
      startDate: 'Mon, 30 Jan 2023',
      endDate: 'Wed, 01 Feb 2023',
      duration: '3 Day(s)',
      day: 'Half Day - First Half',
      status: 'Approve',
      reason: 'Personal Reason'
    },
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 30 Jan 2023',
      leaveType: 'Sick Leave',
      startDate: 'Mon, 30 Jan 2023',
      endDate: 'Wed, 01 Feb 2023',
      duration: '3 Day(s)',
      day: 'Half Day - Second Half',
      status: 'Approve',
      reason: 'Personal Reason'
    },
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 30 Jan 2023',
      leaveType: 'Sick Leave',
      startDate: 'Mon, 30 Jan 2023',
      endDate: 'Wed, 01 Feb 2023',
      duration: '3 Day(s)',
      day: 'Full',
      status: 'Approve',
      reason: 'Personal Reason'
    },
    {
      leaveCode: 'LV-PTES-PT-CV10435-01-23-001',
      requestedOn: 'Mon, 30 Jan 2023',
      leaveType: 'Sick Leave',
      startDate: 'Mon, 30 Jan 2023',
      endDate: 'Wed, 01 Feb 2023',
      duration: '3 Day(s)',
      day: 'Full',
      status: 'Approve',
      reason: 'Personal Reason'
    }
  ];

  sortField: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isMobile = window.innerWidth <= 768;
    this.user = this.authService.getCurrentUser();
    this.initCharts();
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = '#809FB8';
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
    const barWidth = 80;

    // Attendance Summary Chart
    this.attendanceChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'My First dataset',
          barThickness: 18,
          borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
          backgroundColor: '#E53935',
          borderColor: '#E53935',
          data: [15, 1, 19, 7, 4, 13, 10, 18, 15, 10, 5, 1]
        },
        {
          label: 'My Second dataset',
          barThickness: 18,
          borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
          backgroundColor: '#0796E5',
          borderColor: '#e2e8f0',
          data: [28, 24, 26, 19, 29, 27, 21, 10, 20, 18, 22, 25]
        }
      ]
    };

    // Calculate chart width for horizontal scrolling
    const labelsCount = this.attendanceChartData.labels.length;
    this.chartWidth = labelsCount * barWidth;

    const barLength = this.attendanceChartData.datasets[0].data.length;
    if (barLength > 7) {
      this.chartWidth = 1000 + ((barLength - 7) * 10);
    }

    this.attendanceChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 300,
              size: 10,
              family: 'Open Sans',
            }
          },
          grid: {
            color: surfaceBorder,
            drawTicks: true,
            drawBorder: true,
          }
        },
        y: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 300,
              size: 10,
              family: 'Open Sans',
            }
          },
          grid: {
            color: surfaceBorder,
          },
        }
      }
    };

    // Mobile: Y-axis only chart
    this.attendanceChartOptions1 = {
      responsive: false,
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      plugins: {
        legend: {
          display: false
        }
      },
      layout: {
        padding: {
          bottom: 25.5,
        }
      },
      scales: {
        x: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          ticks: {
            display: false,
          },
          grid: {
            drawTicks: false,
          }
        },
        y: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 300,
              size: 10,
              family: 'Open Sans',
            },
          },
          beginAtZero: true,
          afterFit: (ctx: any) => {
            ctx.width = 28.5;
          }
        }
      }
    };

    // Mobile: Chart data only (no Y-axis)
    this.attendanceChartOptions2 = {
      responsive: false,
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      plugins: {
        legend: {
          display: false
        }
      },

      layout: {
        padding: {
          top: 9.5,
        }
      },
      scales: {
        x: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 300,
              size: 10,
              family: 'Open Sans',
            }
          },
          grid: {
            color: surfaceBorder,
            drawTicks: true,
          }
        },
        y: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          beginAtZero: true,
          ticks: {
            display: false,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            drawTicks: false,
          },
        }
      }
    };

    // Attendance Completeness Chart
    this.completenessChartData = {
      labels: ['Not Complete', 'Complete'],
      datasets: [{
        data: [50, 50],
        backgroundColor: ['#E53935', '#0796E5']
      }]
    };

    this.completenessChartOptions = {
      responsive: true,
      aspectRatio: this.isMobile ? 1 : 0.8,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 24,
            font: {
              size: 12, weight: 300, family: 'Open Sans', textDecoration: 'none'
            },
            // sort: (a: any, b: any) => {
            //   return b.index - a.index;
            // },
            generateLabels: (chart: any) => {
              const total = chart.data.labels.length;
              const labels = chart.data.labels.slice().reverse();

              return labels.map((label: string, i: number) => {
                const originalIndex = total - 1 - i;
                const isVisible = chart.getDataVisibility(originalIndex);

                return {
                  text: label,
                  fillStyle: label === 'Complete' ? '#0796E5' : '#E53935',
                  strokeStyle: 'transparent',
                  borderRadius: 2,
                  index: originalIndex,
                  hidden: !isVisible
                };
              });
            },
            onClick: (e: any, legendItem: any, legend: any) => {
              const chart = legend.chart;
              // toggle visibility slice
              chart.toggleDataVisibility(legendItem.index);
              chart.update();
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
    };

    // Overall Task Progress Chart
    this.progressChartData = {
      labels: ['Unscheduled', 'Overdue', 'Complete'],
      datasets: [{
        data: [25, 25, 50],
        backgroundColor: ['#D4DFE7', '#FF9800', '#0796E5']
      }]
    };

    this.progressChartOptions = {
      responsive: true,
      aspectRatio: this.isMobile ? 0.9 : 0.8,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 24,
            font: {
              size: 12, weight: 300, family: 'Open Sans', textDecoration: 'none'
            },
            generateLabels: (chart: any) => {
              const total = chart.data.labels.length;
              const labels = chart.data.labels.slice().reverse();

              return labels.map((label: string, i: number) => {
                const originalIndex = total - 1 - i;
                const isVisible = chart.getDataVisibility(originalIndex);

                return {
                  text: label,
                  fillStyle:
                    label === 'Complete' ? '#0796E5' :
                      label === 'Overdue' ? '#FF9800' : '#D4DFE7',
                  strokeStyle: 'transparent',
                  borderRadius: 2,
                  index: originalIndex,
                  hidden: !isVisible
                };
              });
            },
            onClick: (e: any, legendItem: any, legend: any) => {
              const chart = legend.chart;
              chart.toggleDataVisibility(legendItem.index);
              chart.update();
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
    };

    // Task Completion Chart
    this.taskCompletionChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Complete',
          data: [50, 120, 80, 100, 100, 70, 50, 100, 40, 80, 70, 120],
          borderColor: '#0796E5',
          backgroundColor: '#0796E526',
          fill: true,
          tension: 0.4,
          pointBorderColor: '#08539A',
          pointBackgroundColor: '#E1F4FE',
        },
        {
          label: 'Created Task',
          data: [25, 60, 100, 80, 120, 100, 145, 70, 110, 140, 50, 100],
          borderColor: '#FF9800',
          backgroundColor: '#FF980026',
          fill: true,
          tension: 0.4,
          pointBorderColor: '#AA6B15',
          pointBackgroundColor: '#FFECD0',
        }
      ]
    };

    this.taskCompletionChartData.labels.unshift('');
    this.taskCompletionChartData.datasets[0].data.unshift(0);
    this.taskCompletionChartData.datasets[0].data.push(0);
    this.taskCompletionChartData.datasets[1].data.unshift(0);
    this.taskCompletionChartData.datasets[1].data.push(0);

    this.taskCompletionChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 300,
              size: 10,
              family: 'Open Sans',
            }
          },
          grid: {
            color: surfaceBorder,
            drawTicks: true,
          }
        },
        y: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          min: 0,
          ticks: {
            stepSize: 50,
            color: textColorSecondary,
            font: {
              weight: 300,
              size: 10,
              family: 'Open Sans',
            },
            callback: (value: any) => value
          },
          grid: {
            color: surfaceBorder
          }
        }
      },
    };

    this.taskCompletionChartData1 = {
      labels: this.taskCompletionChartData.labels,
      datasets: [
        {
          label: this.taskCompletionChartData.datasets[0].label,
          data: this.taskCompletionChartData.datasets[0].data,
        },
        {
          label: this.taskCompletionChartData.datasets[1].label,
          data: this.taskCompletionChartData.datasets[1].data,
        }
      ]
    };
    // Mobile: Y-axis only chart
    this.taskCompletionChartOptions1 = {
      responsive: false,
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      plugins: {
        legend: {
          display: false
        }
      },
      layout: {
        padding: {
          bottom: 25.5,
        }
      },
      showLine: false,
      pointBorderWidth: 0,
      pointBackgroundColor: 'transparent',
      pointBorderColor: 'transparent',
      scales: {
        x: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          ticks: {
            display: false,
          },
          grid: {
            drawTicks: false,
          },
        },
        y: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 300,
              size: 10,
              family: 'Open Sans',
            },
          },
          beginAtZero: true,
          afterFit: (ctx: any) => {
            ctx.width = 24.5;
          }
        }
      }
    };

    // Mobile: Chart data only (no Y-axis)
    this.taskCompletionChartOptions2 = {
      responsive: false,
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      plugins: {
        legend: {
          display: false
        }
      },
      layout: {
        padding: {
          top: 9.5,
        }
      },
      scales: {
        x: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 300,
              size: 10,
              family: 'Open Sans',
            }
          },
          grid: {
            color: surfaceBorder,
            drawTicks: true,
          },
        },
        y: {
          border: {
            color: textColorSecondary,
            width: 2,
          },
          beginAtZero: true,
          ticks: {
            display: false,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            drawTicks: false,
          },
        },
      }
    };
  }


  toggleDisplayMode(mode: 'monthly' | 'yearly') {
    this.displayMode = mode;
  }

  onPeriodChange(event: any): void {
    if (event && event instanceof Date) {
      this.selectedPeriod = event;
    }
  }

  get datePickerView(): 'year' | 'month' {
    return this.displayMode === 'yearly' ? 'year' : 'month';
  }

  getDatePickerFormat(): string {
    return this.displayMode === 'yearly' ? 'yy' : 'MM yy';
  }

  sortTable(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }

    this.leaveRecapData.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Handle date strings
      if (field === 'requestedOn' || field === 'startDate' || field === 'endDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle duration strings (extract number)
      if (field === 'duration') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (aValue < bValue) {
        return this.sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}

