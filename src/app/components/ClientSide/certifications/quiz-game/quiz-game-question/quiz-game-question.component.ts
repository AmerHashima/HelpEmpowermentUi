import { Component, computed, effect, inject, signal } from '@angular/core';
import { FeatureComponent } from '../../../../../shared/clientSide/feature/feature.component';
import { SiteButtonComponent } from '../../../../../shared/clientSide/site-button/site-button.component';
import { Shared } from '../../../../../shared/Services/shared/shared';
import { TranslatePipe } from '@ngx-translate/core';
import { GenericModelComponent } from '../../../../../shared/generic-model/generic-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Question1Component } from '../question1/question1.component';
import { FirstQuestionComponent } from '../first-question/first-question.component';
import { SecondQuestionComponent } from '../second-question/second-question.component';
import { MultiTableQuestionsComponent } from '../multi-table-questions/multi-table-questions.component';
import { PyramidDragDropComponent } from '../pyramid-drag-drop/pyramid-drag-drop.component';
import { GenericDragMatchComponent } from '../generic-drag-match/generic-drag-match.component';
import { MatchingTableComponent } from '../matching-table/matching-table.component';

interface QuizLevel {
  level: string;
  title: string;
  header1: string;
  header2: string;
  options?: string[];
  questions: string[];
  rows?:any,
  columns?:any,
  tableOptions?:any,
  tableCorrectAnswers?:any,
  type?:string
  headers?: string[];
  dropSlotsPerQuestion?:number;
  correctAnswers: Record<string, string[]>;
}
@Component({
  selector: 'app-quiz-game-question',
  imports: [FeatureComponent, SiteButtonComponent, TranslatePipe, GenericModelComponent, Question1Component,
    FirstQuestionComponent, SecondQuestionComponent, MultiTableQuestionsComponent,
    PyramidDragDropComponent, GenericDragMatchComponent, MatchingTableComponent
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
  showConfirm: boolean = false;
  showMessage: boolean = false;
  showResetConfirm: boolean = false;
  currentLevelIndex = signal(0);
  score = signal(0);
  gameFinished = signal(false);
  resetTrigger = signal(0);


  levels: QuizLevel[] = [
    {
      level: 'level 1',
      title: '5 Process Group',
      header1: '',
      header2: '',
      questions:[],
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
    {
      level: 'level 7',
      title: 'Mapping between Process Group & Knowledge Area (49 Processes) ',
      header1: '',
      header2: '',
      headers:[
        'Initiating',
        'Planning',
        'Executing',
        'Monitoring &Control',
        'Closing'
      ],
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
      options:[
        "Develop project charter",
        "Identify Stakeholders",
        "Develop project management plan",
        "-Plan Scope Management\n-Collect Requirements\n-Define Scope\n-Create WBS",
        "-Plan Schedule Management\n-Define Activities\n-Sequence Activities\n-Estimate Activity Durations\n-Develop Schedule",
        "-Plan Cost Management\n-Estimate Costs\n-Determine Budget\n",
        "Plan Quality Management",
        "-Plan Resource Management\n-Estimate Activity Resource",
        "-Plan Communications Management",
        "-Plan Risk Management\n-Identify Risks\n-Perform Qualitative Risk Analysis\n-Perform Quantitative Risk Analysis\n-Plan Risk Responses\n",
        "-Plan Procurement Management",
        "Plan Stakeholder Engagement",
        "-Direct and manage project\n-Manage Project Knowledge work",
        "Manage Quality",
        "-Acquire Resources\n-Develop Team\n-Manage Team",
        "Manage Communications",
        "Implement Risk Responses",
        "Conduct Procurements ",
        "Manage Stakeholder Engagement",
        "-Monitor & control project work.\n-Perform integrated change control",
        "-Validate Scope\n-Control Scope",
        "Control Schedule",
        "Control Costs",
        "Control Quality",
        "Control Resources",
        "Monitor Communications",
        "Monitor Risks",
        "Control Procurements",
        "Monitor Stakeholder Engagement"
      ],
      correctAnswers: {
        // row 0 = Project Integration Management
        '0-0': ['Develop project charter'],                     // Initiation (single)
        '0-1': ['Develop project management plan'],             // Planning (single)
        '0-2': ['-Direct and manage project\n-Manage Project Knowledge work'],  // Executing (multiline)
        '0-3': ['-Monitor & control project work.\n-Perform integrated change control'], // Monitoring & Controlling (multiline)
        '0-4': ['Close project or phase'],                      // Closing (single)

        // row 1 = Project Scope Management
        '1-0': [],
        '1-1': ['-Plan Scope Management\n-Collect Requirements\n-Define Scope\n-Create WBS'],
        '1-2': [],
        '1-3': ['-Validate Scope\n-Control Scope'],
        '1-4': [],

        // row 2 = Project Schedule Management
        '2-0': [],
        '2-1': ['-Plan Schedule Management\n-Define Activities\n-Sequence Activities\n-Estimate Activity Durations\n-Develop Schedule'],
        '2-2': [],
        '2-3': ['Control Schedule'],
        '2-4': [],

        // row 3 = Project Cost Management
        '3-0': [],
        '3-1': ['-Plan Cost Management\n-Estimate Costs\n-Determine Budget'],
        '3-2': [],
        '3-3': ['Control Costs'],
        '3-4': [],

        // row 4 = Project Quality Management
        '4-0': [],
        '4-1': ['Plan Quality Management'],
        '4-2': ['Manage Quality'],
        '4-3': ['Control Quality'],
        '4-4': [],

        // row 5 = Project Resource Management
        '5-0': [],
        '5-1': ['-Plan Resource Management\n-Estimate Activity Resource'],
        '5-2': ['-Acquire Resources\n-Develop Team\n-Manage Team'],
        '5-3': ['Control Resources'],
        '5-4': [],

        // row 6 = Project Communications Management
        '6-0': [],
        '6-1': ['-Plan Communications Management'],
        '6-2': ['Manage Communications'],
        '6-3': ['Monitor Communications'],
        '6-4': [],

        // row 7 = Project Risk Management
        '7-0': [],
        '7-1': ['-Plan Risk Management\n-Identify Risks\n-Perform Qualitative Risk Analysis\n-Perform Quantitative Risk Analysis\n-Plan Risk Responses'],
        '7-2': ['Implement Risk Responses'],
        '7-3': ['Monitor Risks'],
        '7-4': [],

        // row 8 = Project Procurement Management
        '8-0': [],
        '8-1': ['-Plan Procurement Management'],
        '8-2': ['Conduct Procurements'],
        '8-3': ['Control Procurements'],
        '8-4': [],

        // row 9 = Project Stakeholder Management
        '9-0': ['Identify Stakeholders'],
        '9-1': ['Plan Stakeholder Engagement'],
        '9-2': ['Manage Stakeholder Engagement'],
        '9-3': ['Monitor Stakeholder Engagement'],
        '9-4': []
      }
    },
    {
      level: 'level 8',
      title: 'OPM & Portfolios & Programs & Projects',
      header1: '',
      header2: '',
      questions: [
        "Provides a strategic framework to delivery organizational strategy",
        "Selects and prioritizes programs and projects",
        "Coordinates the management of related projects",
        "Manages efforts to develop specific scope"
      ],
      options: [
          "Project",
          "ORM",
          "Program",
          "Portfolio"
      ],
      correctAnswers: {
        "level1": ['ORM'],
        "level2": ['Portfolio'],
        "level3": ['Program'],
        "level4": ['Project']
      }
    },
    {
      level: 'level 9',
      title: 'Project Management Office (PMO)',
      type:'text',
      header1: '',
      header2: '',
      questions: [
        "Policies\nMethodologies\nTemplates\nLesson Learned\nLow level of control",
        "Provide Guidance\nAssists with specific project management tools\nModerate level of control",
        "Provide project manager\nResponsible for the result\nHigh level of control",
      ],
      options: [
        "Supportive PMO",
        "Directive PMO",
        "Controlling PMO",
      ],
      correctAnswers: {
        "level1": ['Supportive PMO'],
        "level2": ['Controlling PMO'],
        "level3": ['Directive PMO'],
      }
    },
    {
      level: 'level 10',
      title: 'Organization types according to Projects prospectives',
      type:'image',
      header1: '',
      header2: '',
      questions: [
        "img1.png",
        "img2.png",
        "img3.png",
        "img4.png",
        "img5.png"
      ],
      options: [
        "Functional",
        "Weak Matrix",
        "Balanced Matrix",
        "Strong Matrix",
        "Projectized Organization"
      ],
      correctAnswers: {
        "level1": ['Functional'],
        "level2": ['Balanced Matrix'],
        "level3": ['Weak Matrix'],
        "level4": ['Strong Matrix'],
        "level5": ['Projectized Organization'],
      }
    },
    {
      level: 'level 11',
      title: 'Organization types according to Projects prospectives',
      type: 'text',
      header1: '',
      header2: '',
      questions: [
        "Project team members have more than one boss.",
        "No Home for team members when project is completed.",
        "The project Manager has little or no authority",
      ],
      options: [
        "Projectized Organization",
        "Functional Organization",
        "Matrix Organization",
      ],
      correctAnswers: {
        "level1": ['Matrix Organization'],
        "level2": ['Projectized Organization'],
        "level3": ['Functional Organization'],
      }
    },
    {
      level: 'level 12',
      title: 'Scrum VS Kanban',
      type: 'image',
      header1: '',
      header2: '',
      questions: [
        "scrum.png",
       "kanban.png"
      ],
      options: [
       "Kanban",
       "Scrum"
      ],
      correctAnswers: {
        "level1": ['Scrum'],
        "level2": ['Kanban'],
      }
    },
    {
      level: 'level 13',
      title: 'Scrum VS Kanban',
      type: 'image',
      dropSlotsPerQuestion: 2,
      header1: '',
      header2: '',
      questions: [
        "scrum.png",
        "kanban.png"
      ],
      options: [
        "Time-boxed iterations are optional",
        "Time-boxed iterations are an essential part",
        "Product Owner, Scrum master, development team",
        "No required roles. The whole team owns the kanban board"
      ],
      correctAnswers: {
        "level1": ['Time-boxed iterations are an essential part', 'Product Owner, Scrum master, development team'],
        "level2": ['Time-boxed iterations are optional', 'No required roles. The whole team owns the kanban board'],
      }
    },
    {
      level: 'level 14',
      title: 'Scrum VS Kanban',
      type: 'image',
      dropSlotsPerQuestion: 2,
      header1: '',
      header2: '',
      questions: [
        "scrum.png",
        "kanban.png"
      ],
      options: [
        "Sprints, Sprint backlogs and product backlogs",
        "Teams should not make changes during the sprint",
        "Cards on boards",
        "Changes can happen at any time"
      ],
      correctAnswers: {
        "level1": ['Sprints, Sprint backlogs and product backlogs','Teams should not make changes during the sprint'],
        "level2": ['Cards on boards', 'Changes can happen at any time'],
      }
    },
    {
      level: 'level 15',
      title: 'Economic models',
      headers: ['Economic models', 'Project A', 'Project B', 'Which Project would you pick'],
      correctAnswers: {},
      header1: '',
      header2: '',
      questions: [],
      rows: [
        {
          id: 'row1',
          columns: [
            {
              type: 'text', value: 'Net Present Value' },
            {
              type: 'text', value: '95000' },
            {
              type: 'text', value: '75000' }
          ]
        },
        {
          id: 'row2',
          columns: [
            { type: 'text', value: 'IRR' },
            { type: 'text', value: '13%' },
            { type: 'text', value: '17%' }
          ]
        }
      ],
      columns: [
        { key: 'projectA', label: 'Project A' },
        { key: 'projectB', label: 'Project B' }
      ],
      tableOptions: [
        { id: 'a', label: 'Project A' },
        { id: 'b', label: 'Project B' }
      ],
      tableCorrectAnswers: {
        row1: 'a',
        row2: 'b'
      }
    },
    {
      level: 'level 16',
      title: 'Economic models',
      headers: ['Economic models', 'Project A', 'Project B', 'Which Project would you pick'],
      correctAnswers:{},
      header1: '',
      header2: '',
      questions: [  ],
      rows: [
        {
          id: 'row1',
          columns: [
            { type: 'text', value: 'Payback Period' },
            { type: 'text', value: '16 months' },
            { type: 'text', value: '21 months' }
          ]
        },
        {
          id: 'row2',
          columns: [
            { type: 'text', value: 'Benefit Cost Ratio' },
            { type: 'text', value: '1.3' },
            { type: 'text', value: '2.79' }
          ]
        }
      ],
      columns: [
        { key: 'projectA', label: 'Project A' },
        { key: 'projectB', label: 'Project B' }
      ],
      tableOptions: [
        { id: 'a', label: 'Project A' },
        { id: 'b', label: 'Project B' }
      ],
      tableCorrectAnswers: {
        row1: 'a',
        row2: 'b'
      }
    },
    {
      level: 'level 17',
      title: 'Agile Values',
      type: 'text',
      header1: '',
      header2: '',
      questions: [
        "Individuals and interactions",
        "Working software"
      ],
      options: [
        "comprehensive documentation",
        "process and tools",
      ],
      correctAnswers: {
        "level1": ['process and tools'],
        "level2": ['comprehensive documentation'],
      }
    },
    {
      level: 'level 18',
      title: 'Agile Values',
      type: 'text',
      header1: '',
      header2: '',
      questions: [
        "Customer collaboration",
        "Responding to change"
      ],
      options: [
        "following a plan",
        "contract negotiation",
      ],
      correctAnswers: {
        "level1": ['contract negotiation'],
        "level2": ['following a plan'],
      }
    },
  ];

  attempts = signal(0);
  // maxAttempts = 2;

  currentLevel = computed(() => this.levels[this.currentLevelIndex()]);
  // onGetQuestionResult(isCorrect: boolean) {
  //   this.next.set(false);
  //   if (!isCorrect) {
  //     this.showMessage = true;
  //     this.levelMessage.set({
  //       message: 'OOPS, Your Answer is not correct\nTry Again Later....',
  //       isCorrect: false
  //     })
  //     return;
  //   }


  //   this.score.update(s => s + 1);
  //   console.log(this.currentLevelIndex());
  //   console.log(this.currentLevelIndex() < this.levels.length - 1)
  //   if (this.currentLevelIndex() < this.levels.length - 1) {
  //     this.currentLevelIndex.update(i => i + 1);
  //   }else{
  //     this.showMessage=true;
  //     this.levelMessage.set({
  //       message: 'Well Done,You have rock it',
  //       isCorrect: true
  //     })
  //   }

  // }

  constructor(){
    effect(() => {
      this.currentLevelIndex();
      this.attempts.set(0);
    });
  }
  // onGetQuestionResult(isCorrect: boolean) {
  //   this.next.set(false);

  //   // ✅ correct answer
  //   if (isCorrect) {
  //     this.attempts.set(0);
  //     this.score.update(s => s + 1);

  //     if (this.currentLevelIndex() < this.levels.length - 1) {
  //       this.currentLevelIndex.update(i => i + 1);
  //     } else {
  //       this.showMessage = true;
  //       this.levelMessage.set({
  //         message: 'Well Done, You have rocked it 🎉',
  //         isCorrect: true
  //       });
  //     }

  //     return;
  //   }

  //   // ❌ wrong answer
  //   this.attempts.update(a => a + 1);

  //   // 🔥 FIRST FAIL → allow retry
  //   if (this.attempts() < this.maxAttempts) {
  //     this.showMessage = true;
  //     this.levelMessage.set({
  //       message: `Wrong answer ❌\nTry again (${this.maxAttempts - this.attempts()} attempt left)`,
  //       isCorrect: false
  //     });
  //     return;
  //   }

  //   // 💥 SECOND FAIL → quit
  //   this.showMessage = true;
  //   this.levelMessage.set({
  //     message: 'You failed twice ❌ Quiz ended.',
  //     isCorrect: false
  //   });

  //   this.gameFinished.set(true);

  //   setTimeout(() => {
  //     this.router.navigate(['../quiz-game'], {
  //       relativeTo: this.route
  //     });
  //   }, 2000);
  // }

  onGetQuestionResult(isCorrect: boolean) {
    this.next.set(false);

    // ✅ correct answer
    if (isCorrect) {
      this.attempts.set(0);
      this.score.update(s => s + 1);

      if (this.currentLevelIndex() < this.levels.length - 1) {
        this.currentLevelIndex.update(i => i + 1);
      } else {
        this.showMessage = true;
        this.levelMessage.set({
          message: 'Well Done, You have rocked it 🎉',
          isCorrect: true
        });
      }

      return;
    }

    // ❌ wrong answer → unlimited tries
    this.attempts.update(a => a + 1);

    this.showMessage = true;
    this.levelMessage.set({
      message: `Wrong answer ❌\nKeep trying! (${this.attempts()} attempts)`,
            isCorrect: false
    });
  }

  nextQuestion() {
    this.next.set(true);
  }
  ResetQuiz() {
    this.showResetConfirm = true
  }


  confirmResetQuiz() {
    this.showResetConfirm = false;

    this.resetTrigger.update(v => v + 1);
    // this.attempts.set(0);
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

  closeResultMessage() {
    this.showMessage = false;

    if (!this.gameFinished()) {
      return;
    }

    // ✅ game finished → go back
    this.router.navigate(['../quiz-game'], {
      relativeTo: this.route
    });
  }

    finish(){
      this.next.set(true);

    }
}
