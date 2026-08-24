import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Report, PostType } from 'src/app/model/report.model';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  reports: Report[] = [];
  isSidebarOpen = false;

  page = 1;
  size = 10;
  totalCount = 0;

  PostType = PostType;

  constructor(
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getPending(this.page, this.size)
      .subscribe({
        next: (result) => {
          console.log('REPORT RESPONSE:', result);
          this.reports = result.results;
          this.totalCount = result.totalCount;
        },
        error: (error) => {
          console.error('Error loading reports', error);
        }
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openReport(report: Report): void {
    this.router.navigate(['/report', report.id]);
  }

  nextPage(): void {
    if (this.page < Math.ceil(this.totalCount / this.size)) {
      this.page++;
      this.loadReports();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadReports();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.size);
  }
}