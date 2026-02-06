import { Component, computed, effect, inject, signal } from '@angular/core';
import { ExamsStore } from '../../../AdminPanelStores/ExamsStore/exam.store';
import { CertificationService } from '../../../Services/certification.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { ReusableMaterialTableComponent } from '../../../shared/angular-material-reusable-table/angular-material-reusable-table.component';
import { QuestionsStore } from '../../../AdminPanelStores/QuestionStores/questions.store';
import { Sort } from '../../../models/rquest';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-exam-details',
  // imports: [ReusableMaterialTableComponent],
  imports:[ButtonComponent],
  templateUrl: './exam-details.component.html',
  styleUrl: './exam-details.component.scss'
})
export class ExamDetailsComponent {
  examsStore = inject(ExamsStore);
  questionStore=inject(QuestionsStore);
  certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  exam = this.examsStore.selectedExam;
  total = computed(() => this.questionStore.total());
  pageSize = computed(() => this.questionStore.pageSize());
  loading = computed(() => this.questionStore.loading());
  questions = computed(() => this.questionStore.questions());
  certId:any='';
  columns = [
    { field: 'orderNo', header: 'No.', type: 'text' },
    { field: 'questionText', header: 'Question', type: 'text' },
    {
      field: 'isActive',
      header: 'Status',
      type: 'badge',
      badge: {
        trueLabel: 'Active',
        falseLabel: 'Inactive',
        trueClass: 'bg-success',
        falseClass: 'bg-danger'
      }
    },
    { field: 'actions', header: 'Actions', type: 'buttons' }
  ];
  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('examId');
       this.certId = this.route.snapshot.paramMap.get('id');
      if (id && !this.exam()) {
        this.examsStore.getExam(id);
      }
    });
  }


  openQuestionDetails(exam: any) {
    // const certId = this.certification()?.oid;
    // if (certId)
    //   this.router.navigate(['/admin/certifications', certId, 'exams', 'exam', exam.oid]);
  }
  onAddNewQuestion(exam: any) {
    const examId = this.exam()?.oid;
    if (examId)
      this.router.navigate(['/admin/certifications', this.certId, 'exams', exam.oid, 'question', 'create'
      ]);
  }
  onDeleteQuestion(question: any) {
    this.questionStore.deleteQuestion(question.oid);
  }

  onDeleteExam() {
    const exam = this.exam();
    if (exam && exam.oid) {
      this.examsStore.deleteExam(exam.oid);
      this.router.navigate(['/admin/certifications']);
    }
  }


  // onPageChange(event: PageEvent) {
  onPageChange(event: any) {
    console.log('pagination', event);
    // this.store.setPage(event.pageIndex + 1, event.pageSize);
  }

  onFilterChange(value: string) {
    console.log('filter', value);
    this.questionStore.setSearch(value);
  }

  onSortChange(sort: any) {
    console.log('sort', sort);
    this.questionStore.setSort(sort);
  }

  handleEdit(row: any) {
    // this.oid = row.oid;
    // this.toggleHidden();
    // this.breadcrumb.setBreadcrumbs([
    //   { label: 'Users', url: '/users' },
    //   { label: 'Edit User', url: '' }
    // ]);
  }

  handleDelete(row: any) {
    // this.store.deleteUser(row.oid)
  }

}
