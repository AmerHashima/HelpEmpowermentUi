import { Component, computed, inject, signal } from '@angular/core';
import { FeatureComponent } from '../../../../../shared/clientSide/feature/feature.component';
import { SiteButtonComponent } from '../../../../../shared/clientSide/site-button/site-button.component';
import { Shared } from '../../../../../shared/Services/shared/shared';
import { TranslatePipe } from '@ngx-translate/core';
import { GenericModelComponent } from '../../../../../shared/generic-model/generic-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Question1Component } from '../question1/question1.component';
import { FirstQuestionComponent } from '../first-question/first-question.component';
import { SecondQuestionComponent } from '../second-question/second-question.component';

interface QuizLevel {
  level: string;
  title: string;
  header1: string;
  header2: string;
  options: string[];
  questions: string[];
  correctAnswers: Record<string, string[]>;
}
@Component({
  selector: 'app-quiz-game-question',
  imports: [FeatureComponent, SiteButtonComponent, TranslatePipe, GenericModelComponent, Question1Component,
    FirstQuestionComponent,SecondQuestionComponent
  ],
  templateUrl: './quiz-game-question.component.html',
  styleUrl: './quiz-game-question.component.scss'
})
export class QuizGameQuestionComponent {
  private shared = inject(Shared);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  next = signal<boolean>(false);
  levelMessage = signal<{ message: string, isCorrect: boolean }>({ message: '', isCorrect: false });

  isRTL = this.shared.isRtl;
  showConfirm: boolean = false;
  showMessage: boolean = false;
  showResetConfirm: boolean = false;
  currentLevelIndex = signal(0);
  score = signal(0);
  gameFinished = signal(false);



  levels: QuizLevel[] = [
    {
      level: 'level 1',
      title: '5 Process Group',
      header1: '',
      header2: '',
      questions:[],
      options:[],
      correctAnswers: {} as Record<string, string[]>,
    },
    {
      level: 'level 1',
      title: 'Process Group & Knowledge Area ',
      header1: '5 Process Group',
      header2: '10 Knowledge Area',
      options:[
        'Project Stakeholder Management',
        'Project Risk Management',
        'Project Cost Management',
        'Project Integration Management',
        'Monitoring & Controlling',
        'Project Time Management',
        'Executing',
        'Project Resource Management',
        'Initiating',
        'Project Quality Management',
        'Project Procurement Management',
        'Closing',
        'Project Scope Management',
        'Project Communication Management',
        'Planning'
      ],
      questions: [],
      correctAnswers:{
        'Table1-0': ['Initiating'],
        'Table1-1': ['Planning'],
        'Table1-2': ['Executing'],
        'Table1-3': ['Monitoring & Controlling'],
        'Table1-4': ['Closing'],
        'Table2-0': ['Project Integration Management'],
        'Table2-1': ['Project Scope Management'],
        'Table2-2': ['Project Time Management'],
        'Table2-3': ['Project Cost Management'],
        'Table2-4': ['Project Quality Management'],
        'Table2-5': ['Project Resource Management'],
        'Table2-6': ['Project Communication Management'],
        'Table2-7': ['Project Risk Management'],
        'Table2-8': ['Project Procurement Management'],
        'Table2-9': ['Project Stakeholder Management'],
      },
    },
    {
      level: 'level 2',
      title: 'Process Group & Knowledge Area',
      header1: 'Process Group/Knowledge Area',
      header2: 'Initiation',
      options: [],
      questions: [
        'Project Integration Management',
        'Project Scope Management',
        'Project Schedule Management',
        'Project Cost Management',
        'Project Quality Management',
        'Project Resource Management',
        'Project Communications Management',
        'Project Risk Management',
        'Project Procurement Management',
        'Project Stakeholder Management'
      ],
      correctAnswers: {
        'Project Integration Management': ['Develop project charter'],
        'Project Scope Management': [],
        'Project Schedule Management': [],
        'Project Cost Management': [],
        'Project Quality Management': [],
        'Project Resource Management': [],
        'Project Communications Management': [],
        'Project Risk Management': [],
        'Project Procurement Management': [],
        'Project Stakeholder Management': ['Identify Stakeholders']
      }
    },
    {
      level: 'level 3',
      title: 'Knowledge Area & Planning',
      header1: 'Process Group/Knowledge Area',
      header2: 'Planning',
      options: [],
      questions: [
        'Project Integration Management',
        'Project Scope Management',
        'Project Schedule Management',
        'Project Cost Management',
        'Project Quality Management',
        'Project Resource Management',
        'Project Communications Management',
        'Project Risk Management',
        'Project Procurement Management',
        'Project Stakeholder Management'
      ],

      correctAnswers: {
        'Project Integration Management': ['Develop project management plan'],
        'Project Scope Management': [`-Plan Scope Management\n-Collect Requirements\n-Define Scope\n-Create WBS`],
        'Project Schedule Management': [`-Plan Schedule Management\n-Define Activities\n-Sequence Activities\n-Estimate Activity Durations\n-Develop Schedule`],
        'Project Cost Management': [`-Plan Cost Management\n-Estimate Costs\n-Determine Budget\n`],
        'Project Quality Management': ['Plan Quality Management'],
        'Project Resource Management': [`-Plan Resource Management\n-Estimate Activity Resource`],
        'Project Communications Management': ['-Plan Communications Management'],
        'Project Risk Management': [`-Plan Risk Management\n-Identify Risks\n-Perform Qualitative Risk Analysis\n-Perform Quantitative Risk Analysis\n-Plan Risk Responses\n`],
        'Project Procurement Management': ['-Plan Procurement Management'],
        'Project Stakeholder Management': ['Plan Stakeholder Engagement']
      }
    },
    {
      level: 'level 4',
      title: 'Knowledge Area & Executing',
      header1: 'Process Group/Knowledge Area',
      header2: 'Executing',
      options: [],

      questions: [
        'Project Integration Management',
        'Project Scope Management',
        'Project Schedule Management',
        'Project Cost Management',
        'Project Quality Management',
        'Project Resource Management',
        'Project Communications Management',
        'Project Risk Management',
        'Project Procurement Management',
        'Project Stakeholder Management'
      ],
      correctAnswers: {
        'Project Integration Management': [`-Direct and manage project\n-Manage Project Knowledge work`],
        'Project Scope Management': [],
        'Project Schedule Management': [],
        'Project Cost Management': [],
        'Project Quality Management': ['Manage Quality'],
        'Project Resource Management': [`-Acquire Resources\n-Develop Team\n-Manage Team`],
        'Project Communications Management': ['Manage Communications'],
        'Project Risk Management': ['Implement Risk Responses'],
        'Project Procurement Management': ['Conduct Procurements '],
        'Project Stakeholder Management': ['Manage Stakeholder Engagement']
      }
    },
    {
      level: 'level 5',
      title: 'Knowledge Area & (Monitoring & Controlling)',
      header1: 'Process Group/Knowledge Area',
      header2: 'Monitoring & Controlling  ',
      options: [],

      questions: [
        'Project Integration Management',
        'Project Scope Management',
        'Project Schedule Management',
        'Project Cost Management',
        'Project Quality Management',
        'Project Resource Management',
        'Project Communications Management',
        'Project Risk Management',
        'Project Procurement Management',
        'Project Stakeholder Management'
      ],
      correctAnswers: {
        'Project Integration Management': [`-Monitor & control project work.\n-Perform integrated change control`],
        'Project Scope Management': [`-Validate Scope\n-Control Scope`],
        'Project Schedule Management': ['Control Schedule'],
        'Project Cost Management': ['Control Costs'],
        'Project Quality Management': ['Control Quality'],
        'Project Resource Management': [`Control Resources`],
        'Project Communications Management': ['Monitor Communications'],
        'Project Risk Management': ['Monitor Risks'],
        'Project Procurement Management': ['Control Procurements'],
        'Project Stakeholder Management': ['Monitor Stakeholder Engagement']
      }
    },
    {
      level: 'level 6',
      title: 'Knowledge Area & Closing',
      header1: 'Process Group/Knowledge Area',
      header2: 'Closing',
      options: [],
      questions: [
        'Project Integration Management',
        'Project Scope Management',
        'Project Schedule Management',
        'Project Cost Management',
        'Project Quality Management',
        'Project Resource Management',
        'Project Communications Management',
        'Project Risk Management',
        'Project Procurement Management',
        'Project Stakeholder Management'
      ],
      correctAnswers: {
        'Project Integration Management': ['Close project or phase'],
        'Project Scope Management': [],
        'Project Schedule Management': [],
        'Project Cost Management': [],
        'Project Quality Management': [],
        'Project Resource Management': [],
        'Project Communications Management': [],
        'Project Risk Management': [],
        'Project Procurement Management': [],
        'Project Stakeholder Management': []
      }
    },
  ];


  currentLevel = computed(() => this.levels[this.currentLevelIndex()]);
  onGetQuestionResult(isCorrect: boolean) {
    console.log(isCorrect);
    this.next.set(false);
    if (!isCorrect) {
      this.showMessage = true;
      this.levelMessage.set({
        message: 'OOPS, Your Answer is not correct\nTry Again Later....',
        isCorrect: false
      })
      return;
    }

    // this.levelMessage.set({
    //   message: 'Well Done, Your Answer is correct\nGo To Next Level....',
    //   isCorrect: false
    // })

    this.score.update(s => s + 1);

    if (this.currentLevelIndex() < this.levels.length - 1) {
      this.currentLevelIndex.update(i => i + 1);
      console.log('his.currentLevelIndex', this.currentLevelIndex());
    }

  }

  nextQuestion() {
    console.log('next', this.next());
    this.next.set(true);
    console.log('next',this.next());
  }
  ResetQuiz() {
    this.showResetConfirm = true
  }
  confirmResetQuiz() {
    this.showResetConfirm = false
    this.currentLevelIndex.set(0);
    this.score.set(0);
  }
  cancelResetQuiz() {
    this.showResetConfirm = false
  }

  QuitQuiz() {
    this.showConfirm = true
  }
  confirmQuit() {
    this.ResetQuiz();
    this.router.navigate(['../quiz-game'], {
      relativeTo: this.route
    });
  }
  cancalQuiz() {
    this.showConfirm = false;
  }
}
