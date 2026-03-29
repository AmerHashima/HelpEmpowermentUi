import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import  { QuestionsStore } from '../../../../AdminPanelStores/QuestionStores/questions.store';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-exam-empty-state',
  imports: [SiteButtonComponent,TranslatePipe],
  templateUrl: './no-question.component.html',
  styleUrl: './no-question.component.scss'
})
export class NoQuestionComponent {
  mode = input<string>('');
  store = input<InstanceType<typeof QuestionsStore>>();
  page = input<string>('');
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  onRetry() {
    const store = this.store();
    if (!store) return;

    const request = store.queryRequest();
    if (!request) return;

    store.queryQuestions(request);
  }

  // onBack() {
  //   this.router.navigate(['../../chooseExam'], {
  //     relativeTo: this.route
  //   });
  // }

  onBack() {
    const baseRoute = this.page() !== 'lessonLearned'
      ? '../../chooseExam'
      : '..';

    this.router.navigate([baseRoute], {
      relativeTo: this.route
    });
  }
}
