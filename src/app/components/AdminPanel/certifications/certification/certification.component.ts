import { Component, computed, effect, inject, output } from '@angular/core';
import { APIExam } from '../../../../models/certification';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';
import { CertificationService } from '../../../../Services/certification.service';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-certification',
  imports: [ButtonComponent, AsyncPipe],
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent {
  certificationStore = inject(CertificationsStore);
  certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  certification = this.certificationStore.selectedCertification

  readonly exams$ = computed(() => {
    const oid = this.certification()?.oid;
    return oid
      ? this.certificationService.getCertificationExams(oid)
      : of([] as APIExam[]);
  });

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
  onAddNewQuestion(exam: any) {
    const certId = this.certification()?.oid;
    if (certId)
      this.router.navigate(['/admin/certifications', certId, 'exams',exam.oid, 'question', 'create'
]);
  }
  onDeleteExam(exam: any) {
    this.certificationService.deleteExam(exam.oid).subscribe({});
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
