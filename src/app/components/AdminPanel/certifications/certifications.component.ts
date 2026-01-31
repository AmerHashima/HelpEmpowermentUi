// src\app\components\AdminPanel\certifications\certifications.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { CertificationCardComponent } from '../../../shared/certification-card/certification-card.component';
import { CertificationsStore } from '../../../AdminPanelStores/CertificationStore/certification.store';
import { Certification } from '../../../models/certification';
import { CreateNewCertificationComponent } from '../create-new-certification/create-new-certification.component';
import { CertificationComponent } from '../certification/certification.component';
import { CertificationQuestionComponent } from '../certification-question/certification-question.component';

@Component({
  selector: 'app-certifications',
  imports: [ButtonComponent, CertificationCardComponent,
    CreateNewCertificationComponent, CertificationComponent,
    CertificationQuestionComponent],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
  providers: [CertificationsStore]
})
export class CertificationsComponent {
  private store = inject(CertificationsStore);
  certifications = computed(() => this.store.certifications());
  hidden = signal<boolean>(false);
  showCertification = signal<boolean>(true);
  showCreateQuestion = signal<boolean>(true);

  oid: string = '';

  onAddNewCertification() {
    this.toggleHidden();
  }
  openCertificationPage(certification: Certification) {
    this.oid = certification.oid!;
    this.toggleShowCertification();
  }

  toggleHidden() {
    this.hidden.update(state => !state);
  }
  toggleShowCertification() {
    this.showCertification.update(state => !state);
  }
  onCancal() {
    this.hidden.set(false);
    this.oid = "";
  }
}
