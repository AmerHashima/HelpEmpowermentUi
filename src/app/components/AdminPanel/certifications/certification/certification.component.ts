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
  certificationStore=inject(CertificationsStore);
  certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  certification = this.certificationStore.selectedCertification
  readonly addNewExamEmitter = output<void>();
  readonly addNewQuestionEmitter = output<any>();

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
    this.addNewExamEmitter.emit();
  }
  onAddNewQuestion(exam: any) {
    this.addNewQuestionEmitter.emit(exam);
  }
  onDeleteExam(exam: any) {
  }

  onEditCertification(){
    const cert = this.certification();
    if (cert && cert.oid) {
      console.log('in edit');
      this.certificationStore.setSelectedCertification(cert);
      // this.certificationStore.setSelectedOperation('edit');
      this.router.navigate(['/admin/certifications', cert.oid, 'edit']);

    }
  }
  onDeleteCertification(){
    const cert = this.certification();
    if (cert && cert.oid) {
      console.log('in delete');
      this.certificationStore.deleteCertification(cert.oid);
      this.router.navigate(['/admin/certifications']);
  }
}

}
