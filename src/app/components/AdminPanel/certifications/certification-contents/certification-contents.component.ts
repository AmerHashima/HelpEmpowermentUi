import { Component, computed, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { ActivatedRoute } from '@angular/router';
import { CertificationService } from '../../../../Services/certification.service';

@Component({
  selector: 'app-certification-contents',
  imports: [ReactiveFormsModule],
  templateUrl: './certification-contents.component.html',
  styleUrl: './certification-contents.component.scss'
})
export class CertificationContentsComponent {
  private store = inject(CertificationsStore);
  private route = inject(ActivatedRoute);
  private certificationService = inject(CertificationService);
  certification = this.store.selectedCertification;
  courseId = computed(() => this.certification()?.oid)
  private choiceAnswerOrderCounter=0;
  fb = inject(FormBuilder);
  form = this.fb.group({
    contents: this.fb.array([]),
  });
  createContentGroup(order?: number): FormGroup {
    const group = this.fb.group({
      courseOutlineOid: ['', Validators.required],
      titleEn: ['', Validators.required],
      titleAr: ['', Validators.required],
      contentTypeLookupId: ['', Validators.required],
      contentOid: ['', Validators.required],
      orderNo: [order ?? this.choiceAnswerOrderCounter, Validators.required],
      isFree: [false,Validators.required]

    });
    this.choiceAnswerOrderCounter++;
    return group;
  }

  get contentArrays(): FormArray {
    return this.form.get('contents') as FormArray;
  }
}
