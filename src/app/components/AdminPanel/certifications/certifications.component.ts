import { Component, computed, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { CertificationCardComponent } from '../../../shared/certification-card/certification-card.component';
import { CertificationsStore } from '../../../AdminPanelStores/CertificationStore/certification.store';
import { Certification } from '../../../models/certification';
import { CreateNewCertificationComponent } from '../create-new-certification/create-new-certification.component';
import { CertificationComponent } from '../certification/certification.component';
import { CertificationQuestionComponent } from '../certification-question/certification-question.component';
import { CreateNewExamComponent } from '../create-new-exam/create-new-exam.component';

@Component({
  selector: 'app-certifications',
  imports: [ButtonComponent, CertificationCardComponent,
    CreateNewCertificationComponent, CertificationComponent,
    CertificationQuestionComponent, CreateNewExamComponent],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
  providers: [CertificationsStore]
})
export class CertificationsComponent {
  private store = inject(CertificationsStore);
  certifications = computed(() => this.store.certifications());
  hidden = signal<boolean>(false);
  showCertification = signal<boolean>(false);
  showCreateExam = signal<boolean>(false);
  showCreateQuestion = signal<boolean>(false);
  oid: string = '';
  certification = signal<Certification>({} as Certification);

  onAddNewCertification() {
    this.toggleHidden();
  }

  openCertificationPage(certification: Certification) {
    this.oid = certification.oid!;
    this.certification.set({ ...certification });
    this.toggleShowCertification();
  }

  toggleHidden() {
    this.hidden.update(state => !state);
  }
  toggleShowCertification() {
    this.showCertification.update(state => !state);
  }

  addNewExam() {
    this.showCreateExam.set(true);
  }
  onCancal() {
    this.hidden.set(false);
    this.oid = "";
  }

  onExamCancel() {
    this.showCreateExam.set(false);
  }

  addNewQuestion(exam: any) {
    console.log('exam in parent', exam);
    this.showCreateExam.set(false);
    this.showCreateQuestion.set(true);
  }
}
