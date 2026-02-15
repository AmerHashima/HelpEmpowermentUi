import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from '../../../../shared/Services/shared/shared';

@Component({
  selector: 'app-choose-exam',
  imports: [TranslatePipe,GenericModelComponent],
  templateUrl: './choose-exam.component.html',
  styleUrl: './choose-exam.component.scss'
})
export class ChooseExamComponent {
  private router=inject(Router);
  private shared = inject(Shared);

  private route=inject(ActivatedRoute);
  previousExamMode=signal<boolean>(true);
  showConfirm =false;
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
