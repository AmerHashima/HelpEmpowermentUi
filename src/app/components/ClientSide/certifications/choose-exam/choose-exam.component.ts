import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from '../../../../shared/Services/shared/shared';
import { StudentExamService } from '../../../../Services/student-exam.service';
import { AuthService } from '../../../../Services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-choose-exam',
  imports: [TranslatePipe,GenericModelComponent],
  templateUrl: './choose-exam.component.html',
  styleUrl: './choose-exam.component.scss'
})
export class ChooseExamComponent {
  private platformId=inject(PLATFORM_ID);
  private router=inject(Router);
  private shared = inject(Shared);
  private studentExamService = inject(StudentExamService);
  private AuthService = inject(AuthService);

  private route=inject(ActivatedRoute);
  previousExamMode=signal<boolean>(true);
  showConfirm =false;

  startExam(mode:string){
    if (this.shared.currentExamId() != 'free'){
      this.studentExamService.startExam(this.getStartExamPayload()).subscribe({
        next: (exam) => {
          this.shared.studentExamId.set(exam.oid);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('studentExamId', exam.oid);
          }
          if (mode == 'practice')
            this.onChoosePracticeMode();
          else if (mode == 'exam')
            this.onChooseExamMode()
        }
      })
    }else{
      // this.onChoosePracticeMode();
      console.log('start Free exam');
    }

  }
  onChoosePracticeMode(){
    this.router.navigate(['../exams/', this.shared.currentExamId()], {
      relativeTo: this.route,
      queryParams: { mode: 'practice' },
      queryParamsHandling: 'merge',
    });
  }
  onChooseExamMode(){
    this.router.navigate(['../exams/', this.shared.currentExamId()], {
      relativeTo: this.route,
      queryParams: {  mode: 'exam' },
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
    console.log('start exam payload',payload)
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
