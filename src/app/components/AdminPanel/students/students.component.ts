// src\app\components\AdminPanel\students\students.component.ts
import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APIStudent } from '../../../models/student';
import { RequestBody } from '../../../models/rquest';
import { BreadcrumbService } from '../../../Services/breadcrumb.service';
import { StudentService } from '../../../Services/student-service.service';
import { StudentFormPopupComponent } from './student-form-popup/student-form-popup.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
@Component({
    selector: 'app-students',
    imports: [CommonModule, FormsModule, StudentFormPopupComponent, ButtonComponent,SiteButtonComponent],
    templateUrl: './students.component.html',
    styleUrl: './students.component.scss'
})
export class StudentsComponent {
    private studentService = inject(StudentService);
    private breadcrumbService = inject(BreadcrumbService);
    private router = inject(Router);

    students = signal<APIStudent[]>([]);
    loading = signal(false);
    errorMessage = signal('');
    searchText = '';
    isStudentPopupOpen = signal(false);
    editingStudentId = signal<string | null>(null);
    pageIndex = signal(0);
    pageSize = signal(10);
    totalCount = signal(0);

    constructor() {
        effect(() => {
            this.breadcrumbService.setBreadcrumbs([
                { label: 'Admin', url: '/admin' },
                { label: 'Students', url: '/admin/students' }
            ]);
        });

        this.loadStudents();
    }

    openCreatePopup(): void {
        this.editingStudentId.set(null);
        this.isStudentPopupOpen.set(true);
    }

    onSearch(): void {
        this.pageIndex.set(0);
        this.loadStudents();
    }

    nextPage(): void {
        if (!this.canGoNext()) return;
        this.pageIndex.update((value) => value + 1);
        this.loadStudents();
    }

    previousPage(): void {
        if (!this.canGoPrevious()) return;
        this.pageIndex.update((value) => value - 1);
        this.loadStudents();
    }

    onPageSizeChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        const size = Number(target.value);

        if (!Number.isFinite(size) || size <= 0) return;
        this.pageSize.set(size);
        this.pageIndex.set(0);
        this.loadStudents();
    }

    openEditPopup(id: string): void {
        this.editingStudentId.set(id);
        this.isStudentPopupOpen.set(true);
    }

    closeStudentPopup(): void {
        this.isStudentPopupOpen.set(false);
        this.editingStudentId.set(null);
    }

    onStudentSaved(): void {
        this.closeStudentPopup();
        this.loadStudents();
    }

    openReservedCourses(studentId: string): void {
        this.router.navigate(['/admin/students', studentId, 'courses']);
    }

    displayCourses(student: APIStudent): string[] {
        if (student.courses?.length) {
            return student.courses;
        }
        return ['No courses'];
        // return ['pmp', 'Imp'];
    }

    removeStudent(id: string): void {
        this.loading.set(true);
        this.errorMessage.set('');

        this.studentService.deleteStudent(id).subscribe({
            next: () => {
                const currentCount = this.students().length;
                if (currentCount <= 1 && this.pageIndex() > 0) {
                    this.pageIndex.update((value) => value - 1);
                }
                this.loadStudents();
            },
            error: (error: unknown) => {
                const message = error instanceof Error ? error.message : 'Failed to delete student';
                this.errorMessage.set(message);
                this.loading.set(false);
            }
        });
    }

    loadStudents(): void {
        this.loading.set(true);
        this.errorMessage.set('');

        this.studentService.searchStudents(this.buildSearchRequest()).subscribe({
            next: ({ students, total }) => {
              console.log('Loaded students:', students, 'Total count:', total);
                this.students.set(students);
                this.totalCount.set(total);
                this.loading.set(false);
            },
            error: (error: unknown) => {
                const message = error instanceof Error ? error.message : 'Failed to load students';
                this.errorMessage.set(message);
                this.students.set([]);
                this.totalCount.set(0);
                this.loading.set(false);
            }
        });
    }

    totalPages(): number {
        return Math.max(1, Math.ceil(this.totalCount() / this.pageSize()));
    }

    displayPageNumber(): number {
        return this.pageIndex() + 1;
    }

    canGoPrevious(): boolean {
        return this.pageIndex() > 0;
    }

    canGoNext(): boolean {
        return this.displayPageNumber() < this.totalPages();
    }

    private buildSearchRequest(): RequestBody {
        const hasSearch = this.searchText.trim().length > 0;

        return {
            filters: hasSearch
                ? [
                    {
                        propertyName: 'nameEn',
                        value: this.searchText.trim(),
                        operation: 0
                    }
                ]
                : [],
            sort: [
                {
                    sortBy: 'createdAt',
                    sortDirection: 'desc'
                }
            ],
            pagination: {
                getAll: false,
                pageNumber: this.pageIndex(),
                pageSize: this.pageSize()
            },
            columns: ['oid', 'nameEn', 'nameAr', 'email', 'mobile', 'username', 'isActive', 'courses']
        };
    }

  exportStudents() {

    const data = this.students().map((student, index) => ({
      // ID: student.oid,
      ID: index + 1,
      Name: student.nameEn,

      'Arabic Name': student.nameAr,

      Email: student.email,

      Mobile: student.mobile,

      Username: student.username,

      Status: student.isActive ? 'Active' : 'Inactive',

      Courses: student.courses?.length

        ? student.courses.map((c: any) => c).join(', ')

        : 'No Courses'

    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      'Students'

    );

    XLSX.writeFile(

      workbook,

      `Students_${new Date().toISOString().split('T')[0]}.xlsx`

    );

  }
}
