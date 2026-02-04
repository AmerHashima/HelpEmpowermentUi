import { Component, computed, effect, inject, linkedSignal, output } from '@angular/core';
import { APIExam } from '../../../../models/certification';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';
import { CertificationService } from '../../../../Services/certification.service';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CertificationsFeaturesComponent } from '../certifications-features/certifications-features.component';
import { ExamsStore } from '../../../../AdminPanelStores/ExamsStore/exam.store';

@Component({
  selector: 'app-certification',
  imports: [ButtonComponent, AsyncPipe, CertificationsFeaturesComponent],
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent {
  certificationStore = inject(CertificationsStore);
  examsStore = inject(ExamsStore);

  certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  certification = this.certificationStore.selectedCertification
  courseContents=[];
  exams = computed(() => this.examsStore.exams());

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !this.certification()) {
        this.certificationStore.getCertification(id);
      }
    });
  }

  onAddNewExam() {
    const certId = this.certification()?.oid;
    if (certId)
      this.router.navigate(['/admin/certifications', certId, 'exams', 'create']);
  }
  openExamDetails(exam:any){
    const certId = this.certification()?.oid;
    if (certId)
      this.router.navigate(['/admin/certifications', certId, 'exams', 'exam',exam.oid]);
  }
  onAddNewQuestion(exam: any) {
    const certId = this.certification()?.oid;
    if (certId)
      this.router.navigate(['/admin/certifications', certId, 'exams',exam.oid, 'question', 'create'
]);
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

  // addCourseFeature(){

  // }
  addCourseContent(){}

}
