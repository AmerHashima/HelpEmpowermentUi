import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CertificationService } from '../../../../Services/certification.service';
import { LookupService } from '../../../../Services/lookup.service';
import { UserCourseAssignmentService } from '../../../../Services/user-course-assignment.service';
import { APICertification } from '../../../../models/certification';
import { LookupDetail } from '../../../../models/lookup';
import { SaveUserCourseAssignment, UserCourseAssignment } from '../../../../models/user-course-assignment';
import { RequestBody } from '../../../../models/rquest';
import { confirmDelete } from '../../../../shared/utils/confirm-delete';

@Component({
  selector: 'app-user-course-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-course-assignments.component.html',
  styleUrl: './user-course-assignments.component.scss'
})
export class UserCourseAssignmentsComponent {
  userId = input.required<string>();
  private assignmentService = inject(UserCourseAssignmentService);
  private certificationService = inject(CertificationService);
  private lookupService = inject(LookupService);

  assignments = signal<UserCourseAssignment[]>([]);
  courses = signal<APICertification[]>([]);
  assignmentTypes = signal<LookupDetail[]>([]);
  loading = signal(false);
  saving = signal(false);
  deletingId = signal('');
  errorMessage = signal('');
  editingId = signal('');
  model: SaveUserCourseAssignment = this.emptyModel();

  constructor() {
    effect(() => {
      const userId = this.userId();
      if (userId) this.load(userId);
    });
  }

  save(form: NgForm): void {
    if (form.invalid || this.saving()) { form.control.markAllAsTouched(); return; }
    this.saving.set(true); this.errorMessage.set('');
    const request = this.editingId()
      ? this.assignmentService.update(this.editingId(), { ...this.model, userId: this.userId() })
      : this.assignmentService.create({ ...this.model, userId: this.userId() });
    request.subscribe({
      next: () => { this.saving.set(false); this.cancelEdit(form); this.loadAssignments(this.userId()); },
      error: error => { this.saving.set(false); this.errorMessage.set(this.errorText(error)); }
    });
  }

  edit(assignment: UserCourseAssignment): void {
    this.editingId.set(assignment.oid);
    this.model = { userId: assignment.userId, courseId: assignment.courseId, assignmentTypeId: assignment.assignmentTypeId, isPrimary: assignment.isPrimary, isActive: assignment.isActive };
  }

  cancelEdit(form?: NgForm): void {
    this.editingId.set('');
    this.model = this.emptyModel();
    form?.resetForm(this.model);
  }

  async remove(assignment: UserCourseAssignment): Promise<void> {
    if (this.deletingId() || !(await confirmDelete(`Remove the ${assignment.courseName} assignment?`))) return;
    this.deletingId.set(assignment.oid); this.errorMessage.set('');
    this.assignmentService.delete(assignment.oid).subscribe({
      next: () => { this.deletingId.set(''); this.loadAssignments(this.userId()); },
      error: error => { this.deletingId.set(''); this.errorMessage.set(this.errorText(error)); }
    });
  }

  private load(userId: string): void {
    this.loading.set(true); this.errorMessage.set('');
    const courseSearch: RequestBody = {
      filters: [],
      sort: [],
      pagination: { getAll: true, pageNumber: 0, pageSize: 0 },
      columns: []
    };
    forkJoin({ assignments: this.assignmentService.getForUser(userId), courses: this.certificationService.search(courseSearch), types: this.lookupService.getCourseAssignmentTypes() }).subscribe({
      next: ({ assignments, courses, types }) => { this.assignments.set(assignments); this.courses.set(courses.certifications); this.assignmentTypes.set(types.filter(type => type.isActive)); this.loading.set(false); },
      error: error => { this.loading.set(false); this.errorMessage.set(this.errorText(error)); }
    });
  }

  private loadAssignments(userId: string): void {
    this.assignmentService.getForUser(userId).subscribe({ next: values => this.assignments.set(values), error: error => this.errorMessage.set(this.errorText(error)) });
  }

  private emptyModel(): SaveUserCourseAssignment { return { userId: '', courseId: '', assignmentTypeId: '', isPrimary: false, isActive: true }; }
  private errorText(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error;
      if (this.isErrorBody(body)) return body.errorMessage || body.message || error.message;
      return error.message || 'The operation could not be completed.';
    }
    return error instanceof Error ? error.message : 'The operation could not be completed.';
  }

  private isErrorBody(value: unknown): value is { errorMessage?: string; message?: string } {
    return typeof value === 'object' && value !== null;
  }
}
