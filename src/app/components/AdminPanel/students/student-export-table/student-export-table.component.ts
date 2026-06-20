import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { APIStudent } from '../../../../models/student';
import { RequestBody } from '../../../../models/rquest';
import { StudentService } from '../../../../Services/student-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-export-table',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './student-export-table.component.html'
})
export class StudentExportTableComponent {
  private studentService = inject(StudentService);
  students = signal<APIStudent[]>([]);
  studentFeatures = signal<Record<string, any[]>>({});
  loading = signal(false);
  errorMessage = signal('');
  selectedStudents = signal<Set<string>>(new Set());
  searchText: string='';
  selectedStatus = '';

  selectedFeature = '';
  pageIndex = signal(0);
  pageSize = signal(10);
  totalCount = signal(0);


  constructor(){
    console.log('Constructor');
    this.loadStudents();
  }

  onSearch() {

    this.pageIndex.set(0);

    this.loadStudents();

  }
  loadStudents(): void {
    console.log('loadStudents called');
    this.loading.set(true);
    this.errorMessage.set('');

    this.studentService.searchStudents(this.buildSearchRequest()).subscribe({
      next: ({ students, total }) => {
        console.log('Loaded students:', students, 'Total count:', total);
        this.students.set(students);
        this.totalCount.set(total);

        students.forEach(student => {

          this.loadStudentFeatures(student.oid);

        });
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

  private buildSearchRequest(): RequestBody {

    const filters: any[] = [];

    if (this.searchText.trim()) {

      filters.push({

        propertyName: 'nameEn',

        value: this.searchText.trim(),

        operation: 0

      });

    }

    if (this.selectedStatus) {

      filters.push({

        propertyName: 'isActive',

        value: this.selectedStatus === 'active' ? 'true' : 'false',
        operation: 0

      });

    }

    return {

      filters,

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

      columns: [


      ]

    };

  }

  loadStudentFeatures(studentId: string) {

    this.studentService

      .getStudentReservedCourses(studentId)

      .subscribe(courses => {

        const featuresMap = this.studentFeatures();

        featuresMap[studentId] = courses;

        this.studentFeatures.set({

          ...featuresMap

        });

      });

  }
  toggleStudent(studentId: string): void {
    const selected = new Set(this.selectedStudents());

    if (selected.has(studentId)) {
      selected.delete(studentId);
    } else {
      selected.add(studentId);
    }

    this.selectedStudents.set(selected);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedStudents.set(
        new Set(this.students().map((s) => s.oid))
      );
    } else {
      this.selectedStudents.set(new Set());
    }
  }

  isSelected(studentId: string): boolean {
    return this.selectedStudents().has(studentId);
  }

  exportSelectedStudents(): void {
    const selected = this.students().filter(student =>
      this.selectedStudents().has(student.oid)
    );

    const data = selected.map((student, index) => {

      const reservations =
        this.studentFeatures()[student.oid] ?? [];
      return {

        ID: index + 1,

        Name: student.nameEn,

        Email: student.email,

        Mobile: student.mobile,

        Username: student.username,

        Status: student.isActive

          ? 'Active'

          : 'Inactive',

        PromoCode: student.promoCode || 'No Promo',

        PromoValidTo: student.promoToDateValid

          ? new Date(student.promoToDateValid)

            .toLocaleDateString('en-GB')

          : 'N/A',

        Reservations: reservations

          .map(course => {

            const features: string[] = [];

            if (course.examSimulationReserv) {

              features.push('Exam Simulator');

            }

            if (course.recordedCourseReserv) {

              features.push('Recorded Course');

            }

            if (course.liveCourseReserv) {

              features.push('Live Course');

            }

            return `${course.courseName}: ${features.length

                ? features.join(', ')

                : 'No Features Reserved'

              }`;

          })

          .join(' | ')

      };
      // return {
      //   ID: index + 1,
      //   Name: student.nameEn,
      //   Email: student.email,
      //   Mobile: student.mobile,

      //   Reservations: reservations
      //     .map(course => {

      //       const features: string[] = [];

      //       if (course.examSimulationReserv) {
      //         features.push('Exam Simulator');
      //       }

      //       if (course.recordedCourseReserv) {
      //         features.push('Recorded Course');
      //       }

      //       if (course.liveCourseReserv) {
      //         features.push('Live Course');
      //       }

      //       return `${course.courseName}: ${features.length
      //           ? features.join(', ')
      //           : 'No Features Reserved'
      //         }`;
      //     })
      //     .join(' | ')
      // };
    });

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

  studentHasSelectedFeature(studentId: string): boolean {

    if (!this.selectedFeature) return true;

    const courses =

      this.studentFeatures()[studentId] || [];

    return courses.some(course => {

      switch (this.selectedFeature) {

        case 'exam':

          return course.examSimulationReserv;

        case 'recorded':

          return course.recordedCourseReserv;

        case 'live':

          return course.liveCourseReserv;

        default:

          return true;

      }

    });

  }

  nextPage() {

    this.pageIndex.update(v => v + 1);

    this.loadStudents();

  }

  previousPage() {

    if (this.pageIndex() === 0) return;

    this.pageIndex.update(v => v - 1);

    this.loadStudents();

  }

  displayEndRow(): number {

    return Math.min(

      (this.pageIndex() + 1) * this.pageSize(),

      this.totalCount()

    );

  }
}
