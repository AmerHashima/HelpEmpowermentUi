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
    if (!features || features.length === 0) return;

    const requests = features.map((feature: any) => {
      if (feature.oid) {
        return this.certificationService.updateCourseFeature(feature.oid, feature);
      } else {
        return this.certificationService.createCourseFeature(feature);
      }
    });

    forkJoin(requests).subscribe({
      next: (results) => {
        this.courseFeatures.update((prev) => {
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

        this.resetFeaturesForm();
        this.closeModal();
      },
      error: (err) => console.error('Failed to save features', err),
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
    this.resetFeaturesForm();

    const group = this.fb.group({
      courseOid: [feature.courseOid || this.courseId(), Validators.required],
      featureHeader: [feature.featureHeader, Validators.required],
      featureDescription: [feature.featureDescription, Validators.required],
      orderNo: [feature.orderNo, Validators.required],
      oid: [feature.oid] // keep oid for updating later
    });

    this.featureArrays.push(group);

    this.openModal();
  }


}


// import { Component, computed, effect, inject, signal } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { forkJoin, Observable } from 'rxjs';

// import { CertificationService } from '../../../../Services/certification.service';
// import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';

// import { InputComponent } from '../../../../shared/input/input.component';
// import { TextareaComponent } from '../../../../shared/text-area/text-area.component';
// import { GenericFormArrayComponent } from '../../../../shared/generic-form-array/generic-form-array.component';
// import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
// import { NgFor, NgIf } from '@angular/common';

// interface CourseFeature {
//   oid?: string;
//   courseOid: string;
//   featureHeader: string;
//   featureDescription: string;
//   orderNo: number;
// }

// @Component({
//   selector: 'app-certifications-features',
//   standalone: true,
//   imports: [
//     InputComponent,
//     TextareaComponent,
//     GenericFormArrayComponent,
//     GenericModelComponent,
//     NgFor,
//     NgIf
//   ],
//   templateUrl: './certifications-features.component.html',
//   styleUrl: './certifications-features.component.scss'
// })
// export class CertificationsFeaturesComponent {
//   private store = inject(CertificationsStore);
//   private certificationService = inject(CertificationService);
//   private fb = inject(FormBuilder);

//   certification = this.store.selectedCertification;
//   courseId = computed(() => this.certification()?.oid ?? '');

//   courseFeatures = signal<CourseFeature[]>([]);

//   // ✅ STABLE signal (important)
//   initialFeatures = signal<CourseFeature[]>([]);

//   // Modal state
//   showModal = signal(false);
//   modalTitle = signal('Add New Feature');

//   editingFeature = signal<CourseFeature | null>(null);

//   constructor() {
//     effect(() => {
//       const oid = this.certification()?.oid;
//       if (!oid) {
//         this.courseFeatures.set([]);
//         return;
//       }

//       this.certificationService.getCertificationFeatures(oid).subscribe({
//         next: features => this.courseFeatures.set(features || []),
//         error: err => {
//           console.error('Failed to load features', err);
//           this.courseFeatures.set([]);
//         }
//       });
//     });
//   }

//   // ──────────────────────────────────────────────
//   // Form Factory
//   // ──────────────────────────────────────────────
//   formFactory = (feature?: Partial<CourseFeature>): FormGroup => {
//     return this.fb.group({
//       courseOid: [ this.courseId(), Validators.required],
//       featureHeader: [feature?.featureHeader ?? '', Validators.required],
//       featureDescription: [feature?.featureDescription ?? '', Validators.required],
//       orderNo: [
//         feature?.orderNo ?? this.getNextOrderNo(),
//         Validators.required
//       ],
//     });
//   };

//   private getNextOrderNo(): number {
//     const items = this.courseFeatures();
//     if (!items.length) return 1;
//     return Math.max(...items.map(f => f.orderNo)) + 1;
//   }

//   // ──────────────────────────────────────────────
//   // Modal Controls
//   // ──────────────────────────────────────────────
//   openAddModal() {
//     this.editingFeature.set(null);
//     this.initialFeatures.set([]);
//     this.modalTitle.set('Add New Feature');
//     this.showModal.set(true);
//   }

//   openEditModal(feature: CourseFeature) {
//     this.editingFeature.set(feature);
//     this.initialFeatures.set([feature]);
//     this.modalTitle.set('Edit Feature');
//     this.showModal.set(true);
//   }

//   closeModal() {
//     this.showModal.set(false);
//     this.editingFeature.set(null);
//   }

//   // ──────────────────────────────────────────────
//   // Save
//   // ──────────────────────────────────────────────
//   saveFeatures(features: CourseFeature[]) {
//     const requests: Observable<CourseFeature>[] = [];

//     features.forEach(feature => {
//       if (feature.oid) {
//         requests.push(
//           this.certificationService.updateCourseFeature(feature.oid, feature)
//         );
//       } else {
//         requests.push(
//           this.certificationService.createCourseFeature(feature)
//         );
//       }
//     });

//     forkJoin(requests).subscribe({
//       next: results => {
//         this.courseFeatures.set(results);
//         this.closeModal();
//       },
//       error: err => console.error('Save failed', err)
//     });
//   }

//   deleteFeature(feature: CourseFeature) {
//     if (!feature.oid) return;

//     this.certificationService.deleteCourseFeature(feature.oid).subscribe({
//       next: () =>
//         this.courseFeatures.update(list =>
//           list.filter(f => f.oid !== feature.oid)
//         ),
//       error: err => console.error('Delete failed', err)
//     });
//   }
// }

// import { Component, computed, effect, inject, signal } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Observable, map, tap } from 'rxjs';

// import { CertificationService } from '../../../../Services/certification.service';
// import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';

// import { CertificationCommonComponent } from '../certification-common/certification-common.component'; // adjust path
// import { InputComponent } from '../../../../shared/input/input.component';
// import { TextareaComponent } from '../../../../shared/text-area/text-area.component';

// interface CourseFeature {
//   oid?: string;
//   courseOid: string;
//   featureHeader: string;
//   featureDescription: string;
//   orderNo: number;
// }

// @Component({
//   selector: 'app-certifications-features',
//   standalone: true,
//   imports: [
//     CertificationCommonComponent,
//     InputComponent,
//     TextareaComponent,
//   ],
//   templateUrl: './certifications-features.component.html',
//   styleUrl: './certifications-features.component.scss'
// })
// export class CertificationsFeaturesComponent {
//   private store = inject(CertificationsStore);
//   private certificationService = inject(CertificationService);
//   private fb = inject(FormBuilder);

//   certification = this.store.selectedCertification;
//   courseId = computed(() => this.certification()?.oid ?? '');

//   courseFeatures = signal<CourseFeature[]>([]);

//   entityName = 'Feature';

//   constructor() {
//     effect(() => {
//       const oid = this.certification()?.oid;
//       if (!oid) {
//         this.courseFeatures.set([]);
//         return;
//       }

//       this.certificationService.getCertificationFeatures(oid).subscribe({
//         next: (features) => this.courseFeatures.set(features || []),
//         error: (err) => {
//           console.error('Failed to load features', err);
//           this.courseFeatures.set([]);
//         }
//       });
//     });
//   }

//   formFactory = (feature?: CourseFeature): FormGroup => {
//     console.log('formFactory called with:', feature);

//     const group = this.fb.group({
//       // oid: [feature?.oid],
//       courseOid: [feature?.courseOid || this.courseId(), Validators.required],
//       featureHeader: ['', Validators.required],
//       featureDescription: ['', Validators.required],
//       orderNo: [this.getNextOrderNo(), Validators.required],
//     });

//     console.log('Created form group:', group.value, group.controls);

//     return group;
//   };

//   private getNextOrderNo(): number {
//     const items = this.courseFeatures();
//     if (items.length === 0) return 1;
//     return Math.max(...items.map(f => f.orderNo ?? 0)) + 1;
//   }

//   createFeature = (data: CourseFeature): Observable<CourseFeature> => {
//     console.log('createFeature' , 'feature');
//     return this.certificationService.createCourseFeature(data);
//   };

//   updateFeature = (id: string, data: CourseFeature): Observable<CourseFeature> => {
//     return this.certificationService.updateCourseFeature(id, data);
//   };

//   deleteFeatureFn = (id: string): Observable<void> => {
//     return this.certificationService.deleteCourseFeature(id).pipe(
//       map(() => void 0),
//       tap(() => {
//         this.courseFeatures.update(list => list.filter(f => f.oid !== id));
//       })
//     );
//   };
// }

