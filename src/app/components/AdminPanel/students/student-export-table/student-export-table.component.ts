import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { APIStudent } from '../../../../models/student';
import { Filter, RequestBody } from '../../../../models/rquest';
import { StudentService } from '../../../../Services/student-service.service';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../../Services/reservation.service';
import { APICourseReservation } from '../../../../Interface/course-reservation';
import { APIStudentCourse } from '../../../../models/student-course';

@Component({
  selector: 'app-student-export-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-export-table.component.html'
})
// export class StudentExportTableComponent {
//   private studentService = inject(StudentService);
//   private reservationService = inject(ReservationService);

//   students = signal<APIStudent[]>([]);
//   studentFeatures = signal<Record<string, any[]>>({});
//   studentReservations =
//     signal<Record<string, APICourseReservation[]>>({});

//   loading = signal(false);
//   errorMessage = signal('');
//   selectedStudents = signal<Set<string>>(new Set());
//   searchText: string='';
//   selectedStatus = '';

//   selectedFeature = '';
//   pageIndex = signal(0);
//   pageSize = signal(10);
//   totalCount = signal(0);


//   constructor(){
//     console.log('Constructor');
//     this.loadStudents();
//   }

//   onSearch() {

//     this.pageIndex.set(0);

//     this.loadStudents();

//   }
//   loadStudents(): void {
//     console.log('loadStudents called');
//     this.loading.set(true);
//     this.errorMessage.set('');

//     this.studentService.searchStudents(this.buildSearchRequest()).subscribe({
//       next: ({ students, total }) => {
//         console.log('Loaded students:', students, 'Total count:', total);
//         this.students.set(students);
//         this.totalCount.set(total);

//         students.forEach(student => {

//           this.loadStudentFeatures(student.oid);

//         });
//         this.loading.set(false);
//       },
//       error: (error: unknown) => {
//         const message = error instanceof Error ? error.message : 'Failed to load students';
//         this.errorMessage.set(message);
//         this.students.set([]);
//         this.totalCount.set(0);
//         this.loading.set(false);
//       }
//     });
//   }

//   loadReservations(studentCourseId: string) {

//     this.reservationService

//       .getCourseReservationByStudentCourseId(studentCourseId)

//       .subscribe(reservations => {

//         const current = this.studentReservations();

//         current[studentCourseId] = reservations;

//         this.studentReservations.set({

//           ...current

//         });

//       });

//   }

//   private buildSearchRequest(): RequestBody {

//     const filters: any[] = [];

//     if (this.searchText.trim()) {

//       filters.push({

//         propertyName: 'nameEn',

//         value: this.searchText.trim(),

//         operation: 0

//       });

//     }

//     if (this.selectedStatus) {

//       filters.push({

//         propertyName: 'isActive',

//         value: this.selectedStatus === 'active' ? 'true' : 'false',
//         operation: 0

//       });

//     }

//     return {

//       filters,

//       sort: [

//         {

//           sortBy: 'createdAt',

//           sortDirection: 'desc'

//         }

//       ],

//       pagination: {

//         getAll: false,

//         pageNumber: this.pageIndex(),

//         pageSize: this.pageSize()

//       },

//       columns: [


//       ]

//     };

//   }

//   // loadStudentFeatures(studentId: string) {

//   //   this.studentService

//   //     .getStudentReservedCourses(studentId)

//   //     .subscribe(courses => {

//   //       const featuresMap = this.studentFeatures();

//   //       featuresMap[studentId] = courses;

//   //       this.studentFeatures.set({

//   //         ...featuresMap

//   //       });

//   //     });

//   // }

//   loadStudentFeatures(studentId: string) {

//     this.studentService

//       .getStudentReservedCourses(studentId)

//       .subscribe(courses => {

//         const featuresMap = this.studentFeatures();

//         featuresMap[studentId] = courses;

//         this.studentFeatures.set({

//           ...featuresMap

//         });

//         courses.forEach(course => {

//           this.loadReservations(course.oid);

//         });

//       });

//   }
//   toggleStudent(studentId: string): void {
//     const selected = new Set(this.selectedStudents());

//     if (selected.has(studentId)) {
//       selected.delete(studentId);
//     } else {
//       selected.add(studentId);
//     }

//     this.selectedStudents.set(selected);
//   }

//   toggleAll(event: Event): void {
//     const checked = (event.target as HTMLInputElement).checked;

//     if (checked) {
//       this.selectedStudents.set(
//         new Set(this.students().map((s) => s.oid))
//       );
//     } else {
//       this.selectedStudents.set(new Set());
//     }
//   }

//   isSelected(studentId: string): boolean {
//     return this.selectedStudents().has(studentId);
//   }

//   exportSelectedStudents(): void {
//     const selected = this.students().filter(student =>
//       this.selectedStudents().has(student.oid)
//     );

//     const data = selected.map((student, index) => {

//       const reservations =
//         this.studentFeatures()[student.oid] ?? [];
//       return {

//         ID: index + 1,

//         Name: student.nameEn,

//         Email: student.email,

//         Mobile: student.mobile,

//         Username: student.username,

//         Status: student.isActive

//           ? 'Active'

//           : 'Inactive',

//         PromoCode: student.promoCode || 'No Promo',

//         PromoValidTo: student.promoToDateValid

//           ? new Date(student.promoToDateValid)

//             .toLocaleDateString('en-GB')

//           : 'N/A',

//         Reservations: reservations

//           .map(course => {

//             const features: string[] = [];

//             if (course.examSimulationReserv) {

//               features.push('Exam Simulator');

//             }

//             if (course.recordedCourseReserv) {

//               features.push('Recorded Course');

//             }

//             if (course.liveCourseReserv) {

//               features.push('Live Course');

//             }

//             return `${course.courseName}: ${features.length

//                 ? features.join(', ')

//                 : 'No Features Reserved'

//               }`;

//           })

//           .join(' | ')

//       };
//       // return {
//       //   ID: index + 1,
//       //   Name: student.nameEn,
//       //   Email: student.email,
//       //   Mobile: student.mobile,

//       //   Reservations: reservations
//       //     .map(course => {

//       //       const features: string[] = [];

//       //       if (course.examSimulationReserv) {
//       //         features.push('Exam Simulator');
//       //       }

//       //       if (course.recordedCourseReserv) {
//       //         features.push('Recorded Course');
//       //       }

//       //       if (course.liveCourseReserv) {
//       //         features.push('Live Course');
//       //       }

//       //       return `${course.courseName}: ${features.length
//       //           ? features.join(', ')
//       //           : 'No Features Reserved'
//       //         }`;
//       //     })
//       //     .join(' | ')
//       // };
//     });

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(
//       workbook,
//       worksheet,
//       'Students'
//     );

//     XLSX.writeFile(
//       workbook,
//       `Students_${new Date().toISOString().split('T')[0]}.xlsx`
//     );
//   }

//   studentHasSelectedFeature(studentId: string): boolean {

//     if (!this.selectedFeature) return true;

//     const courses =

//       this.studentFeatures()[studentId] || [];

//     return courses.some(course => {

//       switch (this.selectedFeature) {

//         case 'exam':

//           return course.examSimulationReserv;

//         case 'recorded':

//           return course.recordedCourseReserv;

//         case 'live':

//           return course.liveCourseReserv;

//         default:

//           return true;

//       }

//     });

//   }

//   getReservations(studentCourseId: string) {

//     return this.studentReservations()[studentCourseId] ?? [];

//   }

//   nextPage() {

//     this.pageIndex.update(v => v + 1);

//     this.loadStudents();

//   }

//   previousPage() {

//     if (this.pageIndex() === 0) return;

//     this.pageIndex.update(v => v - 1);

//     this.loadStudents();

//   }

//   displayEndRow(): number {

//     return Math.min(

//       (this.pageIndex() + 1) * this.pageSize(),

//       this.totalCount()

//     );

//   }
// }

export class StudentExportTableComponent {

  private studentService = inject(StudentService);
  private reservationService = inject(ReservationService);

  students = signal<APIStudent[]>([]);

  studentFeatures =
    signal<Record<string, APIStudentCourse[]>>({});

  studentReservations =
    signal<Record<string, APICourseReservation[]>>({});

  loading = signal(false);
  errorMessage = signal('');

  selectedStudents =signal(new Set());

  searchText = '';
  mail='';
  selectedStatus = '';

  pageIndex = signal(0);
  pageSize = signal(10);
  totalCount = signal(0);

  constructor() {
    this.loadStudents();
  }
  onSearch(): void {
    this.pageIndex.set(0);

    this.loadStudents();
  }

  loadStudents(): void {
    this.studentFeatures.set({});
    this.studentReservations.set({});

    this.loading.set(true);
    this.errorMessage.set('');

    this.studentService
      .searchStudents(this.buildSearchRequest())
      .subscribe({

        next: ({ students, total }) => {

          this.students.set(students);
          this.totalCount.set(total);

          students.forEach(student => {

            this.loadStudentFeatures(
              student.oid
            );

          });

          this.loading.set(false);

        },

        error: (error: unknown) => {

          const message =
            error instanceof Error
              ? error.message
              : 'Failed to load students';

          this.errorMessage.set(message);

          this.students.set([]);
          this.totalCount.set(0);

          this.loading.set(false);

        }

      });
  }

  private buildSearchRequest(): RequestBody {
    const filters: Filter[] = [];

    if (this.searchText.trim()) {

      filters.push({

        propertyName: 'nameEn',

        value: this.searchText.trim(),

        operation: 0

      });



    }

    if (this.mail.trim()) {



      filters.push({

        propertyName: 'email',

        value: this.mail.trim(),

        operation: 0

      });

    }
    if (this.selectedStatus) {

      filters.push({

        propertyName: 'isActive',

        value:
          this.selectedStatus === 'active'
            ? 'true'
            : 'false',

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

      columns: []

    };
  }
  loadStudentFeatures(studentId: string): void {
    this.studentService
      .getStudentReservedCourses(studentId)
      .subscribe({

        next: courses => {

          const features =
            this.studentFeatures();

          features[studentId] = courses;

          this.studentFeatures.set({
            ...features
          });

          courses.forEach(course => {

            this.loadReservations(
              course.oid
            );

          });

        }

      });
  }
  loadReservations(studentCourseId: string): void {
    this.reservationService
      .getCourseReservationByStudentCourseId(
        studentCourseId
      )
      .subscribe({

        next: reservations => {

          const current =
            this.studentReservations();

          current[studentCourseId] =
            reservations;

          this.studentReservations.set({
            ...current
          });

        },

        error: () => {

          const current =
            this.studentReservations();

          current[studentCourseId] = [];

          this.studentReservations.set({
            ...current
          });

        }

      });
  }
  getReservations(studentCourseId: string): APICourseReservation[] {
    return (
      this.studentReservations()[
      studentCourseId
      ] ?? []
    );
  }

  formatDate( value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    return new Date(value)
      .toLocaleDateString('en-GB');
  }

  toggleStudent(studentId: string): void {
    const selected =
      new Set(this.selectedStudents());

    if (selected.has(studentId)) {

      selected.delete(studentId);

    } else {

      selected.add(studentId);

    }

    this.selectedStudents.set(
      selected
    );}
  toggleAll(event: Event): void {
    const checked =
      (event.target as HTMLInputElement)
        .checked;

    if (checked) {

      this.selectedStudents.set(
        new Set(
          this.students().map(
            s => s.oid
          )
        )
      );

    } else {

      this.selectedStudents.set(
        new Set()
      );

    }}
  isSelected(studentId: string): boolean {
    return this.selectedStudents()
      .has(studentId);}

  // exportSelectedStudents(): void {
  //   const selected =
  //     this.students().filter(
  //       student =>
  //         this.selectedStudents()
  //           .has(student.oid)
  //     );

  //   const rows: any[] = [];

  //   selected.forEach(
  //     (student, index) => {

  //       const courses =
  //         this.studentFeatures()[
  //         student.oid
  //         ] ?? [];

  //       if (!courses.length) {

  //         rows.push({

  //           ID: index + 1,

  //           Student:
  //             student.nameEn,

  //           Email:
  //             student.email,

  //           Mobile:
  //             student.mobile,

  //           Username:
  //             student.username,

  //           Status:
  //             student.isActive
  //               ? 'Active'
  //               : 'Inactive',

  //           PromoCode:
  //             student.promoCode
  //             ?? 'No Promo',

  //           Course:
  //             'No Courses',

  //           Feature:
  //             '-',

  //           Activated:
  //             '-',

  //           Expires:
  //             '-'

  //         });

  //         return;

  //       }

  //       courses.forEach(course => {

  //         const reservations =
  //           this.getReservations(
  //             course.oid
  //           );

  //         if (
  //           !reservations.length
  //         ) {

  //           rows.push({

  //             ID: index + 1,

  //             Student:
  //               student.nameEn,

  //             Email:
  //               student.email,

  //             Mobile:
  //               student.mobile,

  //             Username:
  //               student.username,

  //             Status:
  //               student.isActive
  //                 ? 'Active'
  //                 : 'Inactive',

  //             PromoCode:
  //               student.promoCode
  //               ?? 'No Promo',

  //             Course:
  //               course.courseName,

  //             Feature:
  //               'No Reserved Features',

  //             Activated:
  //               '-',

  //             Expires:
  //               '-'

  //           });

  //           return;

  //         }

  //         reservations.forEach(
  //           reservation => {

  //             rows.push({

  //               ID:
  //                 index + 1,

  //               Student:
  //                 student.nameEn,

  //               Email:
  //                 student.email,

  //               Mobile:
  //                 student.mobile,

  //               Username:
  //                 student.username,

  //               Status:
  //                 student.isActive
  //                   ? 'Active'
  //                   : 'Inactive',

  //               PromoCode:
  //                 student.promoCode
  //                 ?? 'No Promo',

  //               Course:
  //                 course.courseName,

  //               Feature:
  //                 reservation.serviceName,

  //               Activated:
  //                 this.formatDate(
  //                   reservation.reservationDate
  //                 ),

  //               Expires:
  //                 this.formatDate(
  //                   reservation.reservationExpiryDate
  //                 )

  //             });

  //           }
  //         );

  //       });

  //     }
  //   );

  //   const worksheet =
  //     XLSX.utils.json_to_sheet(
  //       rows
  //     );

  //   const workbook =
  //     XLSX.utils.book_new();

  //   XLSX.utils.book_append_sheet(
  //     workbook,
  //     worksheet,
  //     'Students'
  //   );

  //   XLSX.writeFile(
  //     workbook,
  //     `Students_${new Date()
  //       .toISOString()
  //       .split('T')[0]}.xlsx`
  //   );}

  exportSelectedStudents(): void {

    const selected = this.students().filter(

      student => this.selectedStudents().has(student.oid)

    );

    const rows: any[] = [];

    selected.forEach((student, index) => {

      const courses =

        this.studentFeatures()[student.oid] ?? [];

      let firstStudentRow = true;

      courses.forEach(course => {

        const reservations =

          this.getReservations(course.oid);

        if (!reservations.length) {

          rows.push({

            ID: firstStudentRow ? index + 1 : '',

            Student: firstStudentRow

              ? student.nameEn

              : '',

            Email: firstStudentRow

              ? student.email

              : '',

            Mobile: firstStudentRow

              ? student.mobile

              : '',

            Username: firstStudentRow

              ? student.username

              : '',

            Status: firstStudentRow

              ? (student.isActive

                ? 'Active'

                : 'Inactive')

              : '',

            PromoCode: firstStudentRow

              ? (student.promoCode ?? 'No Promo')

              : '',

            Course: course.courseName,

            Feature: 'No Reserved Features',

            ActiveFrom: '-',

            ExpiryDate: '-'

          });

          firstStudentRow = false;

          return;

        }

        reservations.forEach(reservation => {

          rows.push({

            ID: firstStudentRow

              ? index + 1

              : '',

            Student: firstStudentRow

              ? student.nameEn

              : '',

            Email: firstStudentRow

              ? student.email

              : '',

            Mobile: firstStudentRow

              ? student.mobile

              : '',

            Username: firstStudentRow

              ? student.username

              : '',

            Status: firstStudentRow

              ? (student.isActive

                ? 'Active'

                : 'Inactive')

              : '',

            PromoCode: firstStudentRow

              ? (student.promoCode ?? 'No Promo')

              : '',

            Course: course.courseName,

            Feature:

              reservation.serviceName,

            ActiveFrom:

              this.formatDate(

                reservation.reservationDate

              ),

            ExpiryDate:

              this.formatDate(

                reservation.reservationExpiryDate

              )

          });

          firstStudentRow = false;

        });

      });

    });

    const worksheet =

      XLSX.utils.json_to_sheet(rows);

    worksheet['!cols'] = [

      { wch: 6 },   // ID

      { wch: 25 },  // Student

      { wch: 30 },  // Email

      { wch: 18 },  // Mobile

      { wch: 20 },  // Username

      { wch: 12 },  // Status

      { wch: 15 },  // Promo

      { wch: 25 },  // Course

      { wch: 25 },  // Feature

      { wch: 15 },  // Active

      { wch: 15 }   // Expiry

    ];

    const workbook =

      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      'Students'

    );

    XLSX.writeFile(

      workbook,

      `Students_${new Date()

        .toISOString()

        .split('T')[0]}.xlsx`

    );

  }

  nextPage(): void {
    this.pageIndex.update(
      value => value + 1
    );

    this.loadStudents();}


  previousPage(): void {
    if (
      this.pageIndex() === 0
    ) {
      return;
    }

    this.pageIndex.update(
      value => value - 1
    );

    this.loadStudents();
  }
   displayEndRow(): number {
     return Math.min(

       (this.pageIndex() + 1)
       * this.pageSize(),

       this.totalCount()

     );
   }
  }
