import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from 'src/app/services/report.service';
import { Report, ReportStatus, PostType } from 'src/app/model/report.model';
import { HelpRequestService } from 'src/app/services/help-request.service';
import { HelpType } from 'src/app/model/help-request.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnInit {

  report?: Report;

  ReportStatus = ReportStatus;
  PostType = PostType;

  isSidebarOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private helpRequestService: HelpRequestService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.reportService.getById(id).subscribe({
      next: (report) => {
        this.report = report;
      },
      error: (error) => {
        console.error('Error loading report', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/reports']);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  acceptReport(): void {
    if (!this.report) {
      return;
    }

    const update = {
      id: this.report.id,
      status: ReportStatus.Accepted
    };

    this.reportService.update(update).subscribe({
      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Prijava je prihvaćena.'
        }).then(() => {
          this.goBack();
        });

      },

      error: (err) => {
        console.error('Error accepting report', err);

        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri prihvatanju prijave.',
          confirmButtonText: 'U redu'
        });
      }
    });
  }

  rejectReport(): void {
    if (!this.report) {
      return;
    }

    const update = {
      id: this.report.id,
      status: ReportStatus.Rejected
    };

    this.reportService.update(update).subscribe({
      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Prijava je odbijena.'
        }).then(() => {
          this.goBack();
        });

      },

      error: (err) => {
        console.error('Error rejecting report', err);

        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri odbijanju prijave.',
          confirmButtonText: 'U redu'
        });
      }
    });
  }

  openPost(report: Report): void {
    if (report.postType === PostType.Gift) {
      this.router.navigate(['/gift', report.postId]);
      return;
    }
    
    this.helpRequestService.getById(report.postId).subscribe({
      next: (request) => {

        if (request.helpType === HelpType.Asking) {
          this.router.navigate(['/helpRequest', request.id]);
        } else {
          this.router.navigate(['/helpOffer', request.id]);
        }

      },
      error: (error) => {
        console.error('Error loading help request', error);
      }
    });
  }
}