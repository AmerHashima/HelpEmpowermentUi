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
  imports: [TranslatePipe,GenericModelComponent,SiteButtonComponent],
  templateUrl: './choose-exam.component.html',
  styleUrl: './choose-exam.component.scss'
})
export class ChooseExamComponent {
  private auth = inject(AuthService);
  private platformId=inject(PLATFORM_ID);
  private router=inject(Router);
  private shared = inject(Shared);
  isRTL=this.shared.isRtl;
  private studentExamService = inject(StudentExamService);
  private AuthService = inject(AuthService);
 private toasting=inject(ToastingMessagesService);
  private route=inject(ActivatedRoute);
  showConfirm =false;
  
  previousExamMode = computed(() => {
    const examId = this.shared.currentExamId();
    const allReports = this.studentExamService.reports();

    return allReports.some(
      r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
    );
  });
  
  private getStorageKey(examId: string,mode:string) {
    return `exam-progress-student_${this.AuthService.loggedStudent()?.userId}-${mode}-${examId}`;
  }

  startExam(mode: string) {
    const examId = this.shared.currentExamId();

    // Free exam case
    if (examId === 'free') {
      console.log('start Free exam');
      return;
    }

    if (!isPlatformBrowser(this.platformId)) return;

    const storageKey = this.getStorageKey(examId, mode);
    const savedExam = localStorage.getItem(storageKey);

    if (savedExam) {
      const parsed = JSON.parse(savedExam);

      this.shared.studentExamId.set(parsed.studentExamId);
      localStorage.setItem('studentExamId', parsed.studentExamId);

      this.toasting.showToast('Your Exam has been resumed', 'success');
    }
    else {
      this.studentExamService.startExam(this.getStartExamPayload())
        .subscribe({
          next: (exam) => {
            this.shared.studentExamId.set(exam.oid);
            localStorage.setItem('studentExamId', exam.oid);
          }
        });
    }
    if (mode === 'Practice') {
      this.onChoosePracticeMode();
    }
    else if (mode === 'Exam') {
      this.onChooseExamMode();
    }
  }
  onChoosePracticeMode(){
    this.router.navigate(['../exams/', this.shared.currentExamId()], {
      relativeTo: this.route,
      queryParams: { mode: 'Practice' },
      queryParamsHandling: 'merge',
    });
  }
  onChooseExamMode(){
    this.router.navigate(['../exams/', this.shared.currentExamId()], {
      relativeTo: this.route,
      queryParams: {  mode: 'Exam' },
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

  getStartExamPayload(){
    const payload={
      studentOid: this.AuthService.loggedStudent()?.userId!,
      coursesMasterExamOid: this.shared.currentExamId(),
      attemptNo: 0,
      createdBy: this.AuthService.loggedStudent()?.userId!
    }
    return payload;
  }
  openReports(){
  
    if (this.previousExamMode())
      this.router.navigate(['../reports'], {
        relativeTo: this.route
      });
    else this.showConfirm = true;
  }

  openLessonLearnedQuestions(){
    if (this.previousExamMode())
      this.router.navigate(['../lesson-learned'], {
        relativeTo: this.route
      });
    else this.showConfirm=true;
  }
  back(){
    if (this.previousExamMode())
      this.router.navigate(['../exam-simulator'], {
        relativeTo: this.route
      });
  }
}
