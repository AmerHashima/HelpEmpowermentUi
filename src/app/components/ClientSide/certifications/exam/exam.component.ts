import { Component } from '@angular/core';
import { ClientExamQuestionComponent } from '../../client-exam-question/client-exam-question.component';

@Component({
  selector: 'app-exam',
  imports: [ClientExamQuestionComponent],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss'
})
export class ExamComponent {
  currentQuestion = {
    id: 'Q23',
    text: `You are managing a software development project that is currently in the execution phase. A key stakeholder requests a new feature that was not included in the approved project scope. The feature would add significant value, but implementing it will impact the project schedule and cost.

What should you do FIRST?`,
    options: [
      { letter: 'A', text: 'Implement the feature immediately to satisfy the stakeholder' },
      { letter: 'B', text: 'Analyze the impact of the request and submit it through the change control process' },
      { letter: 'C', text: 'Ask the project sponsor to decide whether to add the feature' },
      { letter: 'D', text: 'Reject the request because it is outside the approved scope' }
    ],
    progress: 38,
    questionNumber: 23,
    totalQuestions: 180,
    maxChoices:3
  };
}
