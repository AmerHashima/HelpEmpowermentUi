// src\app\components\ClientSide\certifications\choose-exam\choose-exam.component.ts
import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from '../../../../shared/Services/shared/shared';
import { StudentExamService } from '../../../../Services/student-exam.service';
import { AuthService } from '../../../../Services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { StudentService } from '../../../../Services/student-service.service';
import { APIStudentExamResponse } from '../../../../models/certification';

@Component({
  selector: 'app-choose-exam',
  imports: [TranslatePipe, GenericModelComponent, SiteButtonComponent],
  templateUrl: './choose-exam.component.html',
  styleUrl: './choose-exam.component.scss'
})
export class ChooseExamComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  private studentExamService = inject(StudentExamService);
  private studentService=inject(StudentService);
  isEnrolled=this.studentService.isExamSimulatorEnrolled;
  private auth = inject(AuthService);
  private toasting = inject(ToastingMessagesService);
  private route = inject(ActivatedRoute);
  showConfirm = false;

  previousExamMode = computed(() => {
    const examId = this.shared.currentExamId();
    const allReports = this.studentExamService.reports();

    return allReports.some(
      r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
    );
  });

  private getStorageKey(examId: string, mode: string) {
    return `exam-progress-student_${this.auth.loggedStudent()?.userId}-${mode}-${examId}`;
  }

  startExam(mode: string) {
    const examId = this.shared.currentExamId();

    // Free exam case
    if (examId === 'free' || !this.auth.studentToken) {
      console.log('start Free exam');
      return;
    }

    if (!isPlatformBrowser(this.platformId)) return;

    const storageKey = this.getStorageKey(examId, mode);
    const savedExam = localStorage.getItem(storageKey);

    if (savedExam) {
      console.log('insaved');
      const parsed = JSON.parse(savedExam);

      this.shared.studentExamId.set(parsed.studentExamId);
      localStorage.setItem('studentExamId', parsed.studentExamId);

      this.toasting.showToast('Your Exam has been resumed', 'success');
      this.chooseMode(mode)

    }
    else {
      this.studentExamService.startExam(this.getStartExamPayload())
        .subscribe({
          next: (exam) => {
            console.log('in start');
            this.shared.studentExamId.set(exam.oid);
            localStorage.setItem('studentExamId', exam.oid);
            this.chooseMode(mode)
          }
        });
    }
   
  }

  chooseMode(mode:string){
    if (mode === 'Practice') {
      this.onChoosePracticeMode();
    }
    else if (mode === 'Exam') {
      this.onChooseExamMode();
    }
  }
  onChoosePracticeMode() {
    console.log('in practice mode')
    this.router.navigate(['../exams/', this.shared.currentExamId()], {
      relativeTo: this.route,
      queryParams: { mode: 'Practice' },
      queryParamsHandling: 'merge',
    });
  }
  onChooseExamMode() {
    console.log('in exam mode')

    this.router.navigate(['../exams/', this.shared.currentExamId()], {
      relativeTo: this.route,
      queryParams: { mode: 'Exam' },
      queryParamsHandling: 'merge',
    });
  }

  onStartFreeExam() {
    // this.router.navigate(['../exams/', this.shared.currentExamId()], {
    //   relativeTo: this.route,
    //   queryParams: { mode: 'exam' },
    //   queryParamsHandling: 'merge',
    // });

    console.log('start free exam');
  }

  getStartExamPayload() {
    const payload = {
      studentOid: this.auth.loggedStudent()?.userId!,
      coursesMasterExamOid: this.shared.currentExamId(),
      attemptNo: 0,
      createdBy: this.auth.loggedStudent()?.userId!
    }
    console.log('payload', payload);
    return payload;
  }
  openReports() {

    if (this.previousExamMode() && this.isEnrolled())
      this.router.navigate(['../reports'], {
        relativeTo: this.route
      });
    else this.showConfirm = true;
  }

  openLessonLearnedQuestions() {
    if (this.previousExamMode())
      this.router.navigate(['../lesson-learned'], {
        relativeTo: this.route
      });
    else this.showConfirm = true;
  }
  back() {
    this.router.navigate(['../exam-simulator'], {
      relativeTo: this.route
    });
  }
}
