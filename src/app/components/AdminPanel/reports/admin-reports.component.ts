import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CourseRevenueService } from '../../../Services/course-revenue.service';
import { UserCourseAssignmentService } from '../../../Services/user-course-assignment.service';
import { CourseRevenueReport, RevenueCalculationType } from '../../../models/course-revenue';
import { UserCourseAssignment } from '../../../models/user-course-assignment';
import { RequestBody } from '../../../models/rquest';

@Component({ selector: 'app-admin-reports', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './admin-reports.component.html', styleUrl: './admin-reports.component.scss' })
export class AdminReportsComponent {
  private revenueService = inject(CourseRevenueService);
  private assignmentService = inject(UserCourseAssignmentService);
  private route = inject(ActivatedRoute);
  protected readonly calculationType = RevenueCalculationType;
  activeReport = signal<'revenue' | 'assignments'>('revenue');
  revenueReports = signal<CourseRevenueReport[]>([]);
  revenueTotals = computed(() => this.revenueReports().reduce((totals, item) => ({
    totalRevenue: totals.totalRevenue + item.totalRevenue,
    distributedRevenue: totals.distributedRevenue + item.distributedRevenue,
    pendingRevenue: totals.pendingRevenue + item.pendingRevenue,
    paidRevenue: totals.paidRevenue + item.paidRevenue
  }), { totalRevenue: 0, distributedRevenue: 0, pendingRevenue: 0, paidRevenue: 0 }));
  assignments = signal<UserCourseAssignment[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  assignmentSearch = '';

  constructor() {
    const report = this.route.snapshot.queryParamMap.get('report');
    if (report === 'assignments') this.activeReport.set('assignments');
    this.loadRevenue();
    this.loadAssignments();
  }

  setReport(report: 'revenue' | 'assignments'): void { this.activeReport.set(report); }

  loadRevenue(): void {
    this.loading.set(true); this.errorMessage.set('');
    this.revenueService.searchReport(this.request()).subscribe({
      next: response => { this.revenueReports.set(response.data ?? []); this.loading.set(false); },
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

  private request(): RequestBody { return { filters: [], sort: [], pagination: { getAll: true, pageNumber: 0, pageSize: 0 }, columns: [] }; }
}
