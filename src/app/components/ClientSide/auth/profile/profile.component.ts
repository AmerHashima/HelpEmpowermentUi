// src\app\components\ClientSide\auth\profile\profile.component.ts
import { Component, computed, effect, inject, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { AuthService, changePasswordForm } from '../../../../Services/auth.service';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TitleCasePipe } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { InputComponent } from '../../../../shared/input/input.component';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { StudentService } from '../../../../Services/student-service.service';
import { APIStudentCourse } from '../../../../models/student-course';
import { StudentExamService } from '../../../../Services/student-exam.service';
import { APIStudent } from '../../../../models/student';
import { createdUpdatedOID } from '../../../../data/lookUPS';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgbNavModule, TranslatePipe, TitleCasePipe,
    SiteButtonComponent, InputComponent, PhoneInputComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @ViewChild('registerForm') form!: NgForm;
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
  private authService = inject(AuthService);
  private studentService = inject(StudentService);
  private studentExamService = inject(StudentExamService);
  totalExams = this.studentExamService.reports
  // studentExams = computed(() =>
  //   this.totalExams().filter(report => report.startedAt && report.finishedAt))
  // successRate = this.studentExamService.successRate
  private shared = inject(Shared);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  lang = this.shared.lang;
  studentImage = "assets/images/profile/person.png";
  enrolledCourses = this.studentService.enrolledCourses;
  // savedExams = signal<any[]>([]);



  credentials = {
    firstName: '',
    lastName: '',
    firstNameAr: '',
    lastNameAr: '',
    username: '',
    email: '',
    mobile: "",
  };

  changePasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  showCourseDetailsFlag: boolean = false;
  course = signal<APIStudentCourse | null>(null)
  user = computed(() => this.authService.loggedStudent());
  hasAnyCourseFeature = computed(() => {
    const c = this.course();
    return !!(c?.examSimulationReserv || c?.recordedCourseReserv || c?.liveCourseReserv);
  });
  constructor() {
    effect(() => {
      // this.user = this.authService.loggedStudent();
      const user = this.user()
      if (user) {
        const names = user.nameEn.split(' ');
        const namesAr = user.nameAr.split(' ');
        this.credentials = {
          firstName: names[0] || '',
          lastName: names[1] || '',
          firstNameAr: namesAr[0] || '',
          lastNameAr: namesAr[1] || '',
          username: user.username || '',
          email: user.email || '',
          mobile: user.mobile || '',
        };

      }
    })
  }

  // ngOnInit(): void {
  //   this.savedExams.set(this.loadSavedExams());

  // }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.studentImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // goToExam(exam: any) {
  //   const courseName = exam.exam.courseName.toLowerCase();
  //   const currentExamId = exam.exam.oid
  //   this.shared.studentExamId.set(exam.studentExamId);
  //   localStorage.setItem('studentExamId', exam.studentExamId);
  //   localStorage.setItem('currentExamId', exam.exam.oid);
  //   localStorage.setItem('currentExam', JSON.stringify(exam.exam));
  //   this.shared.currentExamId.set(exam.exam.oid);
  //   this.shared.currentExam.set(exam.exam);
  //   this.router.navigate(['../../certifications/', courseName, 'exams', currentExamId], {
  //     relativeTo: this.route,
  //     queryParams: { mode: exam.examMode },
  //     queryParamsHandling: 'merge',
  //   });
  // }

  // loadSavedExams(): any[] {
  //   const studentId = this.authService.loggedStudent()?.userId;
  //   if (!studentId) return [];

  //   const prefix = `exam-progress-student_${studentId}`;
  //   const exams: any[] = [];

  //   for (let i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);
  //     if (!key || !key.startsWith(prefix)) continue;

  //     const item = localStorage.getItem(key);
  //     if (!item) continue;

  //     try {
  //       exams.push(JSON.parse(item));
  //     } catch {
  //       console.warn('Invalid exam storage item', key);
  //     }
  //   }

  //   return exams;
  // }

  // continueCourse(course: any) {
  //   this.router.navigateByUrl(`/${this.lang()}/certifications/${course.courseName.toLowerCase()}/recorded-course`);
  // }

  getCourseImage(course: APIStudentCourse) {
    console.log(course.courseName.toLowerCase());
    if (course.courseName.toLowerCase() == 'pmp')
      return 'assets/images/certifications/certfication_1.jpeg';
    else return 'assets/images/certifications/certfication_2.jpeg';
  }

  showCourseDetails(course: APIStudentCourse) {
    this.showCourseDetailsFlag = true;
    this.course.set(course);
  }
  onUpdateInfo() {
    console.log(this.user());
    if (this.form.invalid) {

      this.phoneCmps?.forEach(c => c.validateOnSubmit());
      return;
    }
    const payload = {
      oid: this.user()?.userId ?? '',
      nameEn: `${this.credentials.firstName} ${this.credentials.lastName}`,
      nameAr: `${this.credentials.firstNameAr} ${this.credentials.lastNameAr}`,
      email: this.credentials.email,
      mobile: this.credentials.mobile,
      username: this.credentials.username,
      isActive: true,
      updatedBy: createdUpdatedOID

      // updatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    };

    console.log('payload', payload);
    console.log('mobile', this.credentials.mobile);
    this.studentService.updateStudent(payload.oid, payload).subscribe({
      next: (newStudent: APIStudent) => {

        const current = this.authService.loggedStudent();

        if (!current) return;

        const updatedStudent = {
          ...current,
          nameEn: newStudent.nameEn,
          nameAr: newStudent.nameAr,
          email: newStudent.email,
          mobile: newStudent.mobile,
          username: newStudent.username
        }
        this.authService.loggedStudent.set(updatedStudent);
        this.authService.updatedLoggedStudent(updatedStudent)
        // this.toasting.showToast('Account created suffccessfully please login','success');
      },
      error: () => this.toasting.showToast('profile.update.error', 'error')
    })
  }
  onChangePassword(form: NgForm) {
    const payload = {
      oid: this.authService.loggedStudent()?.userId!,
      currentPassword: this.changePasswordForm.currentPassword,
      newPassword: this.changePasswordForm.newPassword,
      confirmPassword: this.changePasswordForm.confirmPassword,
      userId: this.authService.loggedStudent()?.userId!,
      // updatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      updatedBy: createdUpdatedOID

    };

    this.authService.changeStudentPassword(payload).subscribe({
      next: () => {
        form.resetForm();

      },
      error: () => this.toasting.showToast('profile.password.error', 'error')
    })

  }

  navigateToCourseFeatue(key: string) {
    const courseName = this.course()?.courseName.toLowerCase();
    //if (key == "exam-simulator")
    this.studentService.showExamSimulator = true;
    this.router.navigate(['../../certifications/', courseName, key], {


      relativeTo: this.route,

    });
  }


  // getSavedExamProgress(exam: any): number {
  //   const answered =
  //     (exam.examChoiceAnswers?.length ?? 0) +
  //     (exam.examMatchingAnswers?.length ?? 0);

  //   const total = exam.exam?.questionCount ?? 0;

  //   if (!total) return 0;

  //   return Math.round((answered / total) * 100);
  // }

  // getExamProgress(exam: any) {
  //   const total = exam.totalScore ?? 0;
  //   if (!total) return 0;
  //   return Math.round((exam.obtainedScore / total) * 100);
  // }
  // getTotalExamsLength() {
  //   return this.studentExams().length + this.savedExams().length
  // }

  // getSuccessRate(exam:any){
  //   if (!exam.totalScore) return 0;
  //   return Math.round(((exam.obtainedScore / exam.totalScore) * 100) * 10) / 10;
  // }
}


