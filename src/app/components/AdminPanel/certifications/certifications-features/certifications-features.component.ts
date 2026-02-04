import { Component, computed, effect, ElementRef, Inject, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { CertificationService } from '../../../../Services/certification.service';
import { forkJoin, of, tap } from 'rxjs';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { ActivatedRoute } from '@angular/router';
import { TextareaComponent } from '../../../../shared/text-area/text-area.component';
import { NgIf, NgFor } from '@angular/common';
@Component({
  selector: 'app-certifications-features',
  imports: [ButtonComponent, InputComponent, ReactiveFormsModule, TextareaComponent,
    AsyncPipe, NgFor, NgIf],
  templateUrl: './certifications-features.component.html',
  styleUrl: './certifications-features.component.scss'
})
export class CertificationsFeaturesComponent {
  private store = inject(CertificationsStore);
  private route = inject(ActivatedRoute);
  private certificationService = inject(CertificationService);
  certification = this.store.selectedCertification;
  courseId = computed(() => this.certification()?.oid)
  @ViewChild('certModal') modalRef!: ElementRef;
  readonly courseFeatures = signal<any[]>([]);
  choiceAnswerOrderCounter = 0;
  featureIndex = signal<number>(0);
  // readonly courseFeatures$ = computed(() => {
  //   const oid = this.certification()?.oid;
  //   return oid
  //     ? this.certificationService.getCertificationFeatures(oid)
  //     : of([] as any[]);
  // });

  fb = inject(FormBuilder);
  form = this.fb.group({
    features: this.fb.array([]),
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object,

  ) {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !this.certification()) {
        this.store.getCertification(id);
      }
    });

    effect(() => {
      if(this.featureIndex()) {
        this.featureArrays.push(this.createFeatureGroup(this.featureIndex()));
      }
    });
    effect(() => {
      const oid = this.certification()?.oid;
      if (!oid) return;
      this.certificationService.getCertificationFeatures(oid).subscribe({
        next: (features) => this.courseFeatures.set(features || []),
        error: (err) => console.error(err)
      });
    });
  }

  ngAfterViewInit() {
    this.modalRef.nativeElement.addEventListener(
      'hidden.bs.modal',
      () => {
        this.resetFeaturesForm();
      }
    );
  }

  createFeatureGroup(order ?:number): FormGroup {
    const group = this.fb.group({
      courseOid: [this.courseId() || '', Validators.required],
      featureHeader: ['', Validators.required],
      featureDescription: ['', Validators.required],
      orderNo: [order ?? this.choiceAnswerOrderCounter, Validators.required],
    });
    this.choiceAnswerOrderCounter++;
    return group;
  }

  get featureArrays(): FormArray {
    return this.form.get('features') as FormArray;
  }
  resetFeaturesForm(): void {
    this.choiceAnswerOrderCounter = 0;
    this.featureArrays.clear();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onAddAnotherFeature(): void {
    this.featureArrays.push(this.createFeatureGroup());
  }

  onSubmit() {
    const features: any[] = this.form.value.features ?? [];

    const updatedFeatures = features.map((feature: any) => ({
      ...feature,
      courseOid: feature.courseOid || this.courseId()
    }));

    if (!features || features.length === 0) return;

    const requests = features.map((feature: any) =>
      {
      return this.certificationService.createCourseFeature(feature);}
    );
    forkJoin(requests).subscribe({
      next: (createdFeatures) => {
        this.courseFeatures.update((prev) => [...prev, ...createdFeatures]);
        this.resetFeaturesForm();
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to save features', err);
      }
    });
  }
  async closeModal() {
    if (!isPlatformBrowser(this.platformId)) return;

    const bootstrap = await import('bootstrap');

    const modalEl = document.getElementById('CertificationModal');
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
    const modalEl = document.getElementById('CertificationModal');
    if (!modalEl) return;

    // Get existing modal instance or create new
    const modal =
      bootstrap.Modal.getInstance(modalEl) ||
      new bootstrap.Modal(modalEl);

    // Show the modal
    modal.show();
  }

  AddFeature(length: number) {
    this.choiceAnswerOrderCounter=length;
    this.featureIndex.set(length);
    this.openModal();
  }

  AddFeatures(){
    this.featureArrays.push(this.createFeatureGroup());
    this.openModal();
  }

  deleteFeature(feature:any){
    const featureId=feature.oid;
    this.certificationService.deleteCourseFeature(featureId).subscribe({
      next: () => {
        this.courseFeatures.update((prev) =>
          prev.filter((f) => f.oid !== featureId)
        );
      },
      error: (err) => console.error('Failed to delete feature', err),
    });
  }
  editFeature(feature: any) {

  }


}
