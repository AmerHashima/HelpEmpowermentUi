import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CertificationService } from '../../../Services/certification.service';
import { CourseRevenueService } from '../../../Services/course-revenue.service';
import { UserCourseAssignmentService } from '../../../Services/user-course-assignment.service';
import { APICertification } from '../../../models/certification';
import { CourseRevenueShare, CourseRevenueSummary, RevenueCalculationType } from '../../../models/course-revenue';
import { UserCourseAssignment } from '../../../models/user-course-assignment';
import { RequestBody } from '../../../models/rquest';

@Component({ selector: 'app-admin-reports', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-reports.component.html', styleUrl: './admin-reports.component.scss' })
export class AdminReportsComponent {
  private certificationService = inject(CertificationService);
  private revenueService = inject(CourseRevenueService);
  private assignmentService = inject(UserCourseAssignmentService);
  private route = inject(ActivatedRoute);
  protected readonly calculationType = RevenueCalculationType;

  activeReport = signal<'revenue' | 'assignments'>('revenue');
  courses = signal<APICertification[]>([]);
  revenueShares = signal<CourseRevenueShare[]>([]);
  revenueSummary = signal<CourseRevenueSummary | null>(null);
  assignments = signal<UserCourseAssignment[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  selectedCourseId = '';
  assignmentSearch = '';

  constructor() {
    const report = this.route.snapshot.queryParamMap.get('report');
    if (report === 'assignments') this.activeReport.set('assignments');
    this.loadInitial();
  }

  setReport(report: 'revenue' | 'assignments'): void { this.activeReport.set(report); }

  loadRevenue(): void {
    if (!this.selectedCourseId) { this.revenueShares.set([]); this.revenueSummary.set(null); return; }
    this.loading.set(true); this.errorMessage.set('');
    forkJoin({ shares: this.revenueService.searchReport(this.selectedCourseId, this.request()), summary: this.revenueService.summary(this.selectedCourseId) }).subscribe({
      next: result => { this.revenueShares.set(result.shares.data ?? []); this.revenueSummary.set(result.summary); this.loading.set(false); },
      error: () => { this.errorMessage.set('Failed to load the revenue report.'); this.loading.set(false); }
    });
  }

  loadAssignments(): void {
    this.loading.set(true); this.errorMessage.set('');
    const request = this.request();
    const term = this.assignmentSearch.trim();
    if (term) request.filters.push({ propertyName: 'User.Username', value: term, operation: 2 });
    this.assignmentService.search(request).subscribe({
      next: response => { this.assignments.set(response.data ?? []); this.loading.set(false); },
      error: () => { this.errorMessage.set('Failed to load the user course assignment report.'); this.loading.set(false); }
    });
  }

  private loadInitial(): void {
    this.loading.set(true);
    this.certificationService.search(this.request()).subscribe({
      next: result => { this.courses.set(result.certifications); this.selectedCourseId = result.certifications[0]?.oid ?? ''; this.loading.set(false); if (this.selectedCourseId) this.loadRevenue(); this.loadAssignments(); },
      error: () => { this.errorMessage.set('Failed to load report filters.'); this.loading.set(false); }
    });
  }

  private request(): RequestBody { return { filters: [], sort: [], pagination: { getAll: true, pageNumber: 1, pageSize: 50 }, columns: [] }; }
}
