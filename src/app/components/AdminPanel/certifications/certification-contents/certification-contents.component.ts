// src\app\components\AdminPanel\certifications\certification-contents\certification-contents.component.ts
import { Component, computed, effect, ElementRef, Inject, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { ActivatedRoute } from '@angular/router';
import { CertificationService } from '../../../../Services/certification.service';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { forkJoin } from 'rxjs';
import { InputComponent } from '../../../../shared/input/input.component';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';

@Component({
  selector: 'app-certification-contents',
  imports: [ReactiveFormsModule, ButtonComponent, NgIf, NgFor, InputComponent, SpkNgSelectComponent],
  templateUrl: './certification-contents.component.html',
  styleUrl: './certification-contents.component.scss'
})
export class CertificationContentsComponent {
  private store = inject(CertificationsStore);
  private route = inject(ActivatedRoute);
  private certificationService = inject(CertificationService);
  certification = this.store.selectedCertification;
  courseId = computed(() => this.certification()?.oid)
  private choiceAnswerOrderCounter = 0;
  contentIndex = signal<number>(0);
  readonly courseContents = signal<any[]>([]);
  @ViewChild('contentModal') modalRef!: ElementRef;
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
      isFree: [false, Validators.required]

    });
    this.choiceAnswerOrderCounter++;
    return group;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object,

  ) {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !this.certification()) {
        this.store.getCertification(id);
      }
    });

    effect(() => {
      if (this.contentIndex()) {
        this.contentArrays.push(this.createContentGroup(this.contentIndex()));
      }
    });

    effect(() => {
      const oid = this.certification()?.oid;
      if (!oid) return;
      this.certificationService.getCertificationFeatures(oid).subscribe({
        next: (features) => this.courseContents.set(features || []),
        error: (err) => console.error(err)
      });
    });
  }

  ngAfterViewInit() {
    this.modalRef.nativeElement.addEventListener(
      'hidden.bs.modal',
      () => {
        this.resetContentForm();
      }
    );
  }

  get contentArrays(): FormArray {
    return this.form.get('contents') as FormArray;
  }


  AddContent(length: number) {
    this.choiceAnswerOrderCounter = length;
    this.contentIndex.set(length);
    this.openModal();
  }

  AddContents() {
    //console.log('in add contents');
    this.contentArrays.push(this.createContentGroup());
    this.openModal();
  }

  deleteContent(content: any) {
    const id = content.oid;
    this.certificationService.deleteCourseFeature(content).subscribe({
      next: () => {
        this.courseContents.update((prev) =>
          prev.filter((f) => f.oid !== id)
        );
      },
      error: (err) => console.error('Failed to delete content', err),
    });
  }

  onSubmit() {
    const contents: any[] = this.form.value.contents ?? [];
    if (!contents || contents.length === 0) return;

    const requests = contents.map((content: any) => {
      if (content.oid) {
        return this.certificationService.updateCourseContent(content.oid, content);
      } else {
        return this.certificationService.createCourseContent(content);
      }
    });

    forkJoin(requests).subscribe({
      next: (results) => {
        this.courseContents.update((prev) => {
          const updated = [...prev];
          results.forEach((res: any) => {
            const idx = updated.findIndex((f) => f.oid === res.oid);
            if (idx > -1) {
              updated[idx] = res; // update existing
            } else {
              updated.push(res); // add new
            }
          });
          return updated;
        });

        this.resetContentForm();
        this.closeModal();
      },
      error: (err) => console.error('Failed to save features', err),
    });
  }
  editContent(content: any) {
    this.resetContentForm();

    const group = this.fb.group({
      courseOutlineOid: [content.courseOutlineOid, Validators.required],
      titleEn: [content.titleEn, Validators.required],
      titleAr: [content.titleAr, Validators.required],
      contentTypeLookupId: [content.contentTypeLookupId, Validators.required],
      contentOid: [content.contentOid, Validators.required],
      orderNo: [content.orderNo, Validators.required],
      isFree: [content.isFree],
      oid: [content.oid]
    });

    this.contentArrays.push(group);

    this.openModal();
  }


  onAddAnotherContent(): void {
    this.contentArrays.push(this.createContentGroup());
  }
  async closeModal() {
    if (!isPlatformBrowser(this.platformId)) return;

    const bootstrap = await import('bootstrap');

    const modalEl = document.getElementById('CertificationContentModal');
    if (!modalEl) return;

    const modal =
      bootstrap.Modal.getInstance(modalEl) ||
      new bootstrap.Modal(modalEl);

    modal.hide();
  }
  async openModal() {
    if (!isPlatformBrowser(this.platformId)) return;

    const bootstrap = await import('bootstrap');

    // Get modal element
    const modalEl = document.getElementById('CertificationContentModal');
    if (!modalEl) return;

    // Get existing modal instance or create new
    const modal =
      bootstrap.Modal.getInstance(modalEl) ||
      new bootstrap.Modal(modalEl);

    // Show the modal
    modal.show();
  }
  resetContentForm(): void {
    this.choiceAnswerOrderCounter = 0;
    this.contentArrays.clear();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
