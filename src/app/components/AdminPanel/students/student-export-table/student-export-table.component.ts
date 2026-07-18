import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { StudentService } from '../../../../Services/student-service.service';
import {
  SortDirection, StudentExportReport, StudentExportSearchRequest,
  StudentExportSortField
} from '../../../../models/student-export-report';

interface ExportRow {
  ID: number | string;
  Student: string;
  Email: string;
  Mobile: string;
  Username: string;
  Status: string;
  PromoCode: string;
  PeopleUsedPromo: number | string;
  TotalMoneyWithPromo: number | string;
  Certification: string;
  Feature: string;
  ActiveFrom: string;
  Expires: string;
  AddedBy: string;
}

@Component({
  selector: 'app-student-export-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-export-table.component.html'
})
export class StudentExportTableComponent {
  private readonly studentService = inject(StudentService);

  readonly students = signal<StudentExportReport[]>([]);
  readonly loading = signal(false);
  readonly exporting = signal(false);
  readonly errorMessage = signal('');
  readonly selectedStudents = signal<Set<string>>(new Set<string>());
  readonly allMatchingSelected = signal(false);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);

  searchText = '';
  mail = '';
  selectedStatus = '';
  sortBy: StudentExportSortField = 'createdAt';
  sortDirection: SortDirection = 'desc';

  constructor() { this.loadStudents(); }

  onSearch(): void {
    this.pageIndex.set(0);
    this.clearSelection();
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.studentService.searchStudentExportReport(this.buildRequest()).subscribe({
      next: response => {
        if (!response.success) {
          this.errorMessage.set(response.message || response.errors.join(', ') || 'Failed to load students.');
          this.students.set([]);
        } else {
          this.students.set(response.data ?? []);
          this.totalCount.set(response.totalCount ?? 0);
          this.totalPages.set(response.totalPages ?? 0);
          this.pageIndex.set(response.pageNumber ?? this.pageIndex());
          this.selectedStudents.update(selected =>
            new Set([...selected].filter(id => response.data.some(student => student.studentId === id)))
          );
        }
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load the student reservation report.');
        this.students.set([]); this.totalCount.set(0); this.totalPages.set(0); this.loading.set(false);
      }
    });
  }

  toggleStudent(studentId: string): void {
    if (this.allMatchingSelected()) {
      this.allMatchingSelected.set(false);
      this.selectedStudents.set(new Set(
        this.students()
          .map(student => student.studentId)
          .filter(id => id !== studentId)
      ));
      return;
    }

    this.allMatchingSelected.set(false);
    const selected = new Set(this.selectedStudents());
    selected.has(studentId) ? selected.delete(studentId) : selected.add(studentId);
    this.selectedStudents.set(selected);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allMatchingSelected.set(checked);
    this.selectedStudents.set(checked ? new Set(this.students().map(student => student.studentId)) : new Set<string>());
  }

  isSelected(studentId: string): boolean {
    return this.allMatchingSelected() || this.selectedStudents().has(studentId);
  }

  exportSelectedStudents(): void {
    if (this.allMatchingSelected()) {
      this.exporting.set(true);
      this.errorMessage.set('');

      this.studentService.searchStudentExportReport(this.buildRequest(true)).subscribe({
        next: response => {
          if (!response.success) {
            this.errorMessage.set(response.message || response.errors?.join(', ') || 'Failed to export students.');
          } else {
            this.writeStudentsFile(response.data ?? []);
          }
          this.exporting.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to export all matching students.');
          this.exporting.set(false);
        }
      });
      return;
    }

    const selected = this.students().filter(student => this.isSelected(student.studentId));
    this.writeStudentsFile(selected);
  }

  private writeStudentsFile(students: StudentExportReport[]): void {
    const rows = students.flatMap((student, index) => this.toExportRows(student, index + 1));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, `Students_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  previousPage(): void { if (this.pageIndex() > 0) { this.pageIndex.update(value => value - 1); this.loadStudents(); } }
  nextPage(): void { if (this.pageIndex() + 1 < this.totalPages()) { this.pageIndex.update(value => value + 1); this.loadStudents(); } }
  displayStartRow(): number { return this.totalCount() ? this.pageIndex() * this.pageSize() + 1 : 0; }
  displayEndRow(): number { return Math.min((this.pageIndex() + 1) * this.pageSize(), this.totalCount()); }

  private buildRequest(getAll = false): StudentExportSearchRequest {
    const filters: StudentExportSearchRequest['filters'] = [];
    if (this.searchText.trim()) filters.push({ propertyName: 'nameEn', value: this.searchText.trim(), operation: 2 });
    if (this.mail.trim()) filters.push({ propertyName: 'email', value: this.mail.trim(), operation: 2 });
    if (this.selectedStatus) filters.push({ propertyName: 'isActive', value: String(this.selectedStatus === 'active'), operation: 0 });
    return {
      filters,
      sort: [{ sortBy: this.sortBy, sortDirection: this.sortDirection }],
      pagination: {
        getAll,
        pageNumber: getAll ? 0 : this.pageIndex(),
        pageSize: getAll ? 0 : this.pageSize()
      },
      columns: []
    };
  }

  private clearSelection(): void {
    this.allMatchingSelected.set(false);
    this.selectedStudents.set(new Set<string>());
  }

  private toExportRows(student: StudentExportReport, number: number): ExportRow[] {
    const base = {
      ID: number, Student: student.nameEn, Email: student.email, Mobile: student.mobile,
      Username: student.username, Status: student.isActive ? 'Active' : 'Inactive',
      PromoCode: student.promoCode ?? 'No Promo', PeopleUsedPromo: student.numberOfPeopleUsedPromo ?? 0,
      TotalMoneyWithPromo: student.totalMoneyWithPromo ?? 0
    };
    const details = student.courses.flatMap(course =>
      course.reservations.length
        ? course.reservations.map(reservation => ({ Certification: course.courseName, Feature: reservation.serviceName,
            ActiveFrom: this.formatDate(reservation.reservationDate), Expires: this.formatDate(reservation.reservationExpiryDate), AddedBy: reservation.addedBy || '-' }))
        : [{ Certification: course.courseName, Feature: 'No reserved features', ActiveFrom: '-', Expires: '-', AddedBy: '-' }]
    );
    if (!details.length) details.push({ Certification: 'No certifications', Feature: '-', ActiveFrom: '-', Expires: '-', AddedBy: '-' });
    return details.map((detail, index) => ({
      ID: index === 0 ? base.ID : '', Student: index === 0 ? base.Student : '', Email: index === 0 ? base.Email : '',
      Mobile: index === 0 ? base.Mobile : '', Username: index === 0 ? base.Username : '', Status: index === 0 ? base.Status : '',
      PromoCode: index === 0 ? base.PromoCode : '', PeopleUsedPromo: index === 0 ? base.PeopleUsedPromo : '',
      TotalMoneyWithPromo: index === 0 ? base.TotalMoneyWithPromo : '', ...detail
    }));
  }

  private formatDate(value: string | null): string { return value ? new Date(value).toLocaleDateString('en-GB') : '-'; }
}
