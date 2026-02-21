// src\app\components\AdminPanel\certifications\certification\certification.component.ts
import { Component, computed, effect, inject } from '@angular/core';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { AsyncPipe } from '@angular/common';
import { CertificationService } from '../../../../Services/certification.service';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { CertificationsFeaturesComponent } from '../certifications-features/certifications-features.component';
import { ExamsStore } from '../../../../AdminPanelStores/ExamsStore/exam.store';
import { QuestionsStore } from '../../../../AdminPanelStores/QuestionStores/questions.store';
import { CertificationContentsComponent } from '../certification-contents/certification-contents.component';

@Component({
  selector: 'app-certification',
  imports: [ButtonComponent, AsyncPipe, CertificationsFeaturesComponent, CertificationContentsComponent],
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent {
  certificationStore = inject(CertificationsStore);
  questionStore = inject(QuestionsStore);
  examsStore = inject(ExamsStore);

  certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private breadcrumbService = inject(BreadcrumbService);
  certification = this.certificationStore.selectedCertification
  courseContents = [];
  exams = computed(() => this.examsStore.exams());

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !this.certification()) {
        this.certificationStore.getCertification(id);
      }
    });

    effect(() => {
      const cert = this.certification();
      if (cert) {
        this.breadcrumbService.setBreadcrumbs([
          { label: 'Admin', url: '/admin' },
          { label: 'Certifications', url: '/admin/certifications' },
          { label: cert.courseName || 'Certification Details', url: `/admin/certifications/${cert.oid}` }
        ]);
      }
    });
  }

  onAddNewExam() {
    const certId = this.certification()?.oid;
    if (certId)
      this.router.navigate(['/admin/certifications', certId, 'exams', 'create']);
  }
  openExamDetails(exam: any) {
    const certId = this.certification()?.oid;
    if (certId) {
      this.examsStore.setSelectedExam(exam);
      this.router.navigate(['/admin/certifications', certId, 'exams', 'exam', exam.oid]);
    }
  }
  onAddNewQuestion(exam: any) {
    const certId = this.certification()?.oid;
    if (certId) {
      this.questionStore.setSelectedQuestion(null);
      this.router.navigate(['/admin/certifications', certId, 'exams', exam.oid, 'question', 'create'
      ]);
    }

  }
  onDeleteExam(exam: any) {
    this.examsStore.deleteExam(exam.oid);
  }

  onEditCertification() {
    const cert = this.certification();
    if (cert && cert.oid) {
      this.certificationStore.setSelectedCertification(cert);
      this.router.navigate(['/admin/certifications', cert.oid, 'edit']);
    }
  }
  onDeleteCertification() {
    const cert = this.certification();
    if (cert && cert.oid) {
      this.certificationStore.deleteCertification(cert.oid);
      this.router.navigate(['/admin/certifications']);
    }
  }



}
