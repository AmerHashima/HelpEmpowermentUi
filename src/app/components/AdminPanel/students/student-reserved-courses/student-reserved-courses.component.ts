//


// src\app\components\AdminPanel\students\student-reserved-courses\student-reserved-courses.component.ts
import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { CertificationService } from '../../../../Services/certification.service';
import { StudentService } from '../../../../Services/student-service.service';
import { createdUpdatedOID } from '../../../../data/lookUPS';
import { APICertification } from '../../../../models/certification';
import { RequestBody } from '../../../../models/rquest';
import { APIStudentCourse, StudentCourse, updateStudentCourse } from '../../../../models/student-course';
import { ReservationService } from '../../../../Services/reservation.service';
import { APICourseReservation } from '../../../../Interface/course-reservation';
import { LookupService } from '../../../../Services/lookup.service';
import { LookupDetail } from '../../../../models/lookup';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { confirmDelete } from '../../../../shared/utils/confirm-delete';

@Component({
  selector: 'app-student-reserved-courses',
  imports: [CommonModule, FormsModule, RouterLink,SpkNgSelectComponent],
  templateUrl: './student-reserved-courses.component.html',
  styleUrl: './student-reserved-courses.component.scss'
})
export class StudentReservedCoursesComponent {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private certificationService = inject(CertificationService);
  private breadcrumbService = inject(BreadcrumbService);
  private reservationService = inject(ReservationService);
  private lookupService=inject(LookupService);
  originalCourse = signal<APIStudentCourse | null>(null);
  paymentMethods = signal<LookupDetail[]>([]);
  studentId = signal('');
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  courses = signal<APIStudentCourse[]>([]);
  certifications = signal<APICertification[]>([]);
  loadingCertifications = signal(false);
  submittingCourseId = signal<string | null>(null);
  showAddForm = signal(false);
  editingCourseId = signal<string | null>(null);
  editCourse = signal<updateStudentCourse | null>(null);
  manualEnroll = signal<StudentCourse>({
    studentId: '',
    courseId: '',
    price: 0,
    examSimulationReserv: false,
    recordedCourseReserv: true,
    liveCourseReserv: false,
    discountAmount: 0,
    paymentMethod: '',
    createdBy: createdUpdatedOID
  });
  courseReservations = signal<Record<string, APICourseReservation[]>>({});
  deletingReservationId = signal<string | null>(null);

  constructor() {
    this.lookupService.getPaymentMethods().subscribe({

      next: (methods) => this.paymentMethods.set(methods)

    });

    effect(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Admin', url: '/admin' },
        { label: 'Students', url: '/admin/students' },
        { label: 'Reserved Courses', url: `/admin/students/${this.studentId()}/courses` }
      ]);
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Student id is missing.');
      return;
    }

    this.studentId.set(id);
    this.resetManualEnrollForm(id);
    this.loadCertifications();
    this.loadReservedCourses(id);
  }

  loadReservedCourses(id: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.studentService.getStudentReservedCourses(id).subscribe({
      next: (courses) => {
        this.courses.set(courses);


        courses.forEach(course => {

          this.loadReservations(course.oid);

        });
        this.loading.set(false);
      },

      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to load reserved courses';
        this.errorMessage.set(message);
        this.courses.set([]);
        this.loading.set(false);
      }
    });
  }

  private loadReservations(studentCourseId: string): void {

    this.reservationService

      .getCourseReservationByStudentCourseId(studentCourseId)

      .subscribe({

        next: (reservations) => {

          this.courseReservations.update(current => ({

            ...current,

            [studentCourseId]: reservations

          }));

        },

        error: () => {

          this.courseReservations.update(current => ({

            ...current,

            [studentCourseId]: []

          }));

        }

      });

  }

  async deleteService(studentCourseId: string, reservation: APICourseReservation): Promise<void> {
    const serviceName = reservation.serviceName || 'this service';
    if (!(await confirmDelete(`Are you sure you want to delete ${serviceName}?`))) return;

    this.deletingReservationId.set(reservation.oid);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.reservationService.deleteCourseReservation(reservation.oid).subscribe({
      next: () => {
        this.courseReservations.update(current => ({
          ...current,
          [studentCourseId]: (current[studentCourseId] ?? [])
            .filter(item => item.oid !== reservation.oid)
        }));
        this.successMessage.set(`${serviceName} deleted successfully.`);
        this.deletingReservationId.set(null);
      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to delete course service';
        this.errorMessage.set(message);
        this.deletingReservationId.set(null);
      }
    });
  }
  loadCertifications(): void {
    this.loadingCertifications.set(true);

    this.certificationService.search(this.buildCertificationSearchRequest()).subscribe({
      next: ({ certifications }) => {
        this.certifications.set(certifications.filter(c => c.isActive));
        this.loadingCertifications.set(false);
      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to load certifications';
        this.errorMessage.set(message);
        this.certifications.set([]);
        this.loadingCertifications.set(false);
      }
    });
  }

  updateManualEnroll<K extends keyof StudentCourse>(field: K, value: StudentCourse[K]): void {
    this.manualEnroll.update((current) => ({ ...current, [field]: value }));
  }

  openAddForm(): void {
    this.showAddForm.set(true);
    this.editingCourseId.set(null);
    this.editCourse.set(null);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelAddForm(): void {
    this.showAddForm.set(false);
    this.resetManualEnrollForm(this.studentId());
  }

  // startEdit(course: APIStudentCourse): void {
  //   this.showAddForm.set(false);
  //   this.editingCourseId.set(course.oid);
  //   this.editCourse.set(this.buildEditPayload(course));
  //   this.errorMessage.set('');
  //   this.successMessage.set('');
  // }

  startEdit(course: APIStudentCourse): void {

    this.originalCourse.set(course);

    this.showAddForm.set(false);

    this.editingCourseId.set(course.oid);

    this.editCourse.set(this.buildEditPayload(course));

    this.errorMessage.set('');

    this.successMessage.set('');

  }
  cancelEdit(): void {
    this.editingCourseId.set(null);
    this.editCourse.set(null);
  }

  updateEditCourse<K extends keyof updateStudentCourse>(field: K, value: updateStudentCourse[K]): void {
    this.editCourse.update((current) => current ? { ...current, [field]: value } : current);
  }

  canSaveEdit(): boolean {
    const course = this.editCourse();
    return !!course && (this.hasReservationFlags(course) || this.hasNoFlags(course))
  }

  hasNoFlags(course: Pick<StudentCourse, 'examSimulationReserv' | 'recordedCourseReserv' | 'liveCourseReserv'>): boolean {
    return !course.examSimulationReserv && !course.recordedCourseReserv && !course.liveCourseReserv;
  }
  canSubmitManualEnrollment(): boolean {
    const form = this.manualEnroll();
    return !!form.courseId && !!form.paymentMethod.trim() && this.hasReservationFlags(form);
  }

  submitManualEnrollment(): void {
    if (this.submittingCourseId()) {
      return;
    }

    if (!this.canSubmitManualEnrollment()) {
      this.errorMessage.set('Select a certification, enter payment method, and check at least one reservation option.');
      return;
    }

    const form = this.manualEnroll();
    this.submittingCourseId.set('manual');
    this.errorMessage.set('');
    this.successMessage.set('');

    this.studentService.enrollCourse({
      ...form,
      studentId: this.studentId(),
      price: this.normalizeAmount(form.price),
      discountAmount: this.normalizeAmount(form.discountAmount),
      paymentMethod: form.paymentMethod.trim(),
      createdBy: createdUpdatedOID
    }).subscribe({
      next: (createdCourse: APIStudentCourse) => {
        this.createReservationsForCourse(

          createdCourse.oid,

          form.courseId,

          form

        );
        this.submittingCourseId.set(null);
        this.successMessage.set('Student enrolled successfully.');
        this.showAddForm.set(false);
        this.resetManualEnrollForm(this.studentId());
        this.loadReservedCourses(this.studentId());
      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to enroll student in course';
        this.errorMessage.set(message);
        this.submittingCourseId.set(null);
      }
    });
  }

  saveEdit(): void {
    const draft = this.editCourse();
    const id = this.editingCourseId();

    if (!draft || !id || this.submittingCourseId()) {
      return;
    }

    if (!this.canSaveEdit()) {
      this.errorMessage.set('Select at least one reservation option before saving.');
      return;
    }

    this.submittingCourseId.set(id);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.studentService.updateStudentCourseData(id, {
      ...draft,
      progressPercentage: this.normalizePercentage(draft.progressPercentage),
      paidAmount: this.normalizeAmount(draft.paidAmount),
      completedLessons: this.normalizeLessons(draft.completedLessons),
      updatedBy: createdUpdatedOID
    }).subscribe({
      // next: () => {
      //   this.submittingCourseId.set(null);
      //   this.successMessage.set('Student course updated successfully.');
      //   this.cancelEdit();
      //   this.loadReservedCourses(this.studentId());
      // },
      next: () => {

        this.syncReservations();

        this.submittingCourseId.set(null);

        this.successMessage.set('Student course updated successfully.');

        this.cancelEdit();

        this.loadReservedCourses(this.studentId());

      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to update student course';
        this.errorMessage.set(message);
        this.submittingCourseId.set(null);
      }
    });
  }

  canEnroll(course: APIStudentCourse): boolean {
    return !!course.paymentMethod?.trim() && this.hasReservedAccess(course);
  }

  enrollCourse(course: APIStudentCourse): void {
    if (this.submittingCourseId()) {
      return;
    }

    if (!this.canEnroll(course)) {
      this.errorMessage.set('Payment method is required and at least one reserved course type must be selected.');
      return;
    }

    this.submittingCourseId.set(course.oid);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.studentService.enrollCourse(this.buildEnrollPayload(course)).subscribe({
      next: () => {
        this.submittingCourseId.set(null);
        this.successMessage.set('Student enrolled successfully.');
        this.loadReservedCourses(this.studentId());
      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to enroll student in course';
        this.errorMessage.set(message);
        this.submittingCourseId.set(null);
      }
    });
  }

  private hasReservedAccess(course: APIStudentCourse): boolean {
    return course.examSimulationReserv || course.recordedCourseReserv || course.liveCourseReserv;
  }

  private buildCertificationSearchRequest(): RequestBody {
    return {
      filters: [],
      sort: [
        {
          sortBy: 'courseName',
          sortDirection: 'asc'
        }
      ],
      pagination: {
        getAll: true,
        pageNumber: 0,
        pageSize: 0
      },
      columns: ['oid', 'courseName', 'courseCode', 'isActive']
    };
  }

  private hasReservationFlags(course: Pick<StudentCourse, 'examSimulationReserv' | 'recordedCourseReserv' | 'liveCourseReserv'>): boolean {
    return course.examSimulationReserv || course.recordedCourseReserv || course.liveCourseReserv;
  }

  private resetManualEnrollForm(studentId: string): void {
    this.manualEnroll.set({
      studentId,
      courseId: '',
      price: 0,
      examSimulationReserv: false,
      recordedCourseReserv: true,
      liveCourseReserv: false,
      discountAmount: 0,
      paymentMethod: '',
      createdBy: createdUpdatedOID
    });
  }

  private buildEditPayload(course: APIStudentCourse): updateStudentCourse {
    return {
      oid: course.oid,
      paymentStatusLookupId: course.paymentStatusLookupId,
      paidAmount: this.normalizeAmount(course.paidAmount),
      transactionId: course.transactionId,
      paymentDate: course.paymentDate,
      examSimulationReserv: !!course.examSimulationReserv,
      recordedCourseReserv: !!course.recordedCourseReserv,
      liveCourseReserv: !!course.liveCourseReserv,
      enrollmentStatusLookupId: course.enrollmentStatusLookupId,
      progressPercentage: this.normalizePercentage(course.progressPercentage),
      completedLessons: this.normalizeLessons(course.completedLessons),
      updatedBy: createdUpdatedOID
    };
  }

  private buildEnrollPayload(course: APIStudentCourse): StudentCourse {
    return {
      studentId: course.studentId,
      courseId: course.courseId,
      price: this.normalizeAmount(course.price),
      examSimulationReserv: !!course.examSimulationReserv,
      recordedCourseReserv: !!course.recordedCourseReserv,
      liveCourseReserv: !!course.liveCourseReserv,
      discountAmount: this.normalizeAmount(course.discountAmount),
      paymentMethod: course.paymentMethod?.trim() ?? '',
      createdBy: createdUpdatedOID
    };
  }

  private normalizeAmount(value: number | null | undefined): number {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  private normalizePercentage(value: number | null | undefined): number {
    const parsed = Number(value ?? 0);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.min(100, parsed));
  }

  private normalizeLessons(value: number | null | undefined): number {
    const parsed = Number(value ?? 0);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.floor(parsed));
  }

  getReservations(studentCourseId: string): APICourseReservation[] {

    return this.courseReservations()[studentCourseId] ?? [];

  }

  getPaymentMethodName(oid: string | null | undefined): string {

    if (!oid) return '-';

    return (

      this.paymentMethods().find(x => x.oid === oid)?.lookupNameEn ??

      this.paymentMethods().find(x => x.oid === oid)?.lookupNameEn ??

      '-'

    );
}

  private syncReservations(): void {

    const original = this.originalCourse();
    const updated = this.editCourse();

    if (!original || !updated) {
      return;
    }

    this.certificationService
      .getCourseServicesByCourse(original.courseId)
      .subscribe(courseServices => {

        this.syncSingleReservation(
          original,
          updated,
          courseServices,
          'examSimulationReserv',
          'Exam Simulation'
        );

        this.syncSingleReservation(
          original,
          updated,
          courseServices,
          'recordedCourseReserv',
          'Recorded Course'
        );

        this.syncSingleReservation(
          original,
          updated,
          courseServices,
          'liveCourseReserv',
          'Live Course'
        );
      });
  }

  private syncSingleReservation(
    original: APIStudentCourse,
    updated: updateStudentCourse,
    courseServices: any[],
    key:
      | 'examSimulationReserv'
      | 'recordedCourseReserv'
      | 'liveCourseReserv',
    serviceName: string
  ): void {

    const oldValue = !!original[key];
    const newValue = !!updated[key];

    if (oldValue === newValue) {
      return;
    }

    const courseService = courseServices.find(
      s => s.serviceName === serviceName
    );

    if (!courseService) {
      return;
    }

    const reservations =
      this.courseReservations()[original.oid] ?? [];

    // Added
    if (!oldValue && newValue) {

      this.reservationService.CreateReservation({
        studentCourseId: original.oid,
        courseServiceId: courseService.oid,
        reservationDate: new Date().toISOString(),
        servicePrice: courseService.price ?? 0,
        isReserved: true,
        notes: 'Admin',
        createdBy: createdUpdatedOID
      }).subscribe({
        next: () => this.loadReservations(original.oid)
      });

      return;
    }

    // Removed
    if (oldValue && !newValue) {

      const reservation = reservations.find(
        r => r.courseServiceId === courseService.oid
      );

      if (reservation) {
        this.reservationService
          .deleteCourseReservation(reservation.oid)
          .subscribe({
            next: () => this.loadReservations(original.oid)
          });
      }
    }
  }

  private createReservationsForCourse(

    studentCourseId: string,

    courseId: string,

    form: Pick<

      StudentCourse,

      'examSimulationReserv' |

      'recordedCourseReserv' |

      'liveCourseReserv'

    >

  ): void {

    this.certificationService

      .getCourseServicesByCourse(courseId)

      .subscribe(courseServices => {

        this.createReservationIfNeeded(

          studentCourseId,

          courseServices,

          form.examSimulationReserv,

          'Exam Simulation'

        );

        this.createReservationIfNeeded(

          studentCourseId,

          courseServices,

          form.recordedCourseReserv,

          'Recorded Course'

        );

        this.createReservationIfNeeded(

          studentCourseId,

          courseServices,

          form.liveCourseReserv,

          'Live Course'

        );

      });

  }

  private createReservationIfNeeded(

    studentCourseId: string,

    courseServices: any[],

    enabled: boolean,

    serviceName: string

  ): void {

    if (!enabled) {

      return;

    }

    const courseService = courseServices.find(

      x => x.serviceName === serviceName

    );

    if (!courseService) {

      return;

    }

    this.reservationService.CreateReservation({

      studentCourseId,

      courseServiceId: courseService.oid,

      reservationDate: new Date().toISOString(),

      servicePrice: courseService.price ?? 0,

      isReserved: true,

      notes: 'Admin',

      createdBy: createdUpdatedOID

    }).subscribe(
      {
        next: () => {

          this.loadReservedCourses(this.studentId());

        }
      }
    );

  }
}
