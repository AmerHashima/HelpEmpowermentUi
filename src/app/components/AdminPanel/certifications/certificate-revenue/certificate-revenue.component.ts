import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CourseRevenueService } from '../../../../Services/course-revenue.service';
import { LookupService } from '../../../../Services/lookup.service';
import { APIUser, ModeratorService } from '../../../../Services/moderator-services.service';
import { CourseRevenueShare, CourseRevenueSummary, RevenueCalculationType, SaveCourseRevenueShare } from '../../../../models/course-revenue';
import { LookupDetail } from '../../../../models/lookup';
import { RequestBody } from '../../../../models/rquest';
import { confirmDelete } from '../../../../shared/utils/confirm-delete';

@Component({
  selector: 'app-certificate-revenue',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './certificate-revenue.component.html',
  styleUrl: './certificate-revenue.component.scss'
})
export class CertificateRevenueComponent {
  courseId = input.required<string>();
  private fb = inject(FormBuilder);
  private revenueService = inject(CourseRevenueService);
  private lookupService = inject(LookupService);
  private moderatorService = inject(ModeratorService);

  protected readonly calculationType = RevenueCalculationType;
  shares = signal<CourseRevenueShare[]>([]);
  summary = signal<CourseRevenueSummary | null>(null);
  users = signal<APIUser[]>([]);
  shareTypes = signal<LookupDetail[]>([]);
  loading = signal(false);
  saving = signal(false);
  deletingId = signal('');
  editingId = signal('');
  errorMessage = signal('');

  form = this.fb.group({
    beneficiaryUserId: this.fb.control<string | null>(null),
    shareTypeId: this.fb.nonNullable.control('', Validators.required),
    calculationType: this.fb.nonNullable.control(RevenueCalculationType.Percentage, Validators.required),
    value: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
    isActive: this.fb.nonNullable.control(true),
    effectiveFrom: this.fb.control<string | null>(null),
    effectiveTo: this.fb.control<string | null>(null),
    notes: this.fb.control<string | null>(null, Validators.maxLength(500))
  }, { validators: control => this.validateRevenue(control) });

  constructor() {
    effect(() => {
      const courseId = this.courseId();
      if (courseId) this.load(courseId);
    });
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    const courseId = this.courseId();
    const value = this.form.getRawValue();
    const body: SaveCourseRevenueShare = {
      beneficiaryUserId: value.beneficiaryUserId || null,
      shareTypeId: value.shareTypeId,
      calculationType: value.calculationType,
      value: Number(value.value),
      isActive: value.isActive,
      effectiveFrom: value.effectiveFrom || null,
      effectiveTo: value.effectiveTo || null,
      notes: value.notes?.trim() || null
    };
    this.saving.set(true);
    this.errorMessage.set('');
    const request = this.editingId()
      ? this.revenueService.update(courseId, this.editingId(), body)
      : this.revenueService.create(courseId, body);
    request.subscribe({
      next: () => { this.saving.set(false); this.resetForm(); this.reloadRevenue(courseId); },
      error: error => { this.saving.set(false); this.errorMessage.set(this.errorText(error)); }
    });
  }

  edit(share: CourseRevenueShare): void {
    this.editingId.set(share.oid);
    this.form.reset({
      beneficiaryUserId: share.userId,
      shareTypeId: share.shareTypeId,
      calculationType: share.calculationType,
      value: share.value,
      isActive: share.isActive,
      effectiveFrom: this.datePart(share.effectiveFrom),
      effectiveTo: this.datePart(share.effectiveTo),
      notes: share.notes
    });
  }

  resetForm(): void {
    this.editingId.set('');
    this.form.reset({ beneficiaryUserId: null, shareTypeId: '', calculationType: RevenueCalculationType.Percentage, value: 0, isActive: true, effectiveFrom: null, effectiveTo: null, notes: null });
  }

  async remove(share: CourseRevenueShare): Promise<void> {
    if (this.deletingId() || !(await confirmDelete(`Delete the ${share.shareType} revenue share?`))) return;
    this.deletingId.set(share.oid);
    this.errorMessage.set('');
    this.revenueService.delete(this.courseId(), share.oid).subscribe({
      next: () => { this.deletingId.set(''); this.reloadRevenue(this.courseId()); },
      error: error => { this.deletingId.set(''); this.errorMessage.set(this.errorText(error)); }
    });
  }

  private load(courseId: string): void {
    this.loading.set(true);
    this.errorMessage.set('');
    const usersRequest: RequestBody = { filters: [], sort: [{ sortBy: 'Username', sortDirection: 'asc' }], pagination: { getAll: true, pageNumber: 1, pageSize: 50 }, columns: [] };
    forkJoin({
      shares: this.revenueService.search(courseId),
      summary: this.revenueService.summary(courseId),
      users: this.moderatorService.searchModerators(usersRequest),
      types: this.lookupService.getCourseAssignmentTypes()
    }).subscribe({
      next: result => {
        this.shares.set(result.shares);
        this.summary.set(result.summary);
        this.users.set(result.users.moderators.filter(user => user.isActive));
        this.shareTypes.set(result.types.filter(type => type.isActive));
        this.loading.set(false);
      },
      error: error => { this.loading.set(false); this.errorMessage.set(this.errorText(error)); }
    });
  }

  private reloadRevenue(courseId: string): void {
    forkJoin({ shares: this.revenueService.search(courseId), summary: this.revenueService.summary(courseId) }).subscribe({
      next: result => { this.shares.set(result.shares); this.summary.set(result.summary); },
      error: error => this.errorMessage.set(this.errorText(error))
    });
  }

  private validateRevenue(control: AbstractControl): ValidationErrors | null {
    const type = control.get('calculationType')?.value;
    const value = Number(control.get('value')?.value);
    const from = control.get('effectiveFrom')?.value as string | null;
    const to = control.get('effectiveTo')?.value as string | null;
    if (type === RevenueCalculationType.Percentage && value > 100) return { percentageMax: true };
    if (from && to && from > to) return { invalidDateRange: true };
    return null;
  }

  private datePart(value: string | null): string | null { return value ? value.slice(0, 10) : null; }
  private errorText(error: unknown): string {
    if (error instanceof HttpErrorResponse && this.isErrorBody(error.error)) return error.error.message || error.message;
    return error instanceof Error ? error.message : 'The operation could not be completed.';
  }
  private isErrorBody(value: unknown): value is { message?: string } { return typeof value === 'object' && value !== null; }
}
