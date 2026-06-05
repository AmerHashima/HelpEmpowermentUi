// src\app\components\AdminPanel\certifications\certification\certification.component.ts
import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { CertificationService } from '../../../../Services/certification.service';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { ExamsStore } from '../../../../AdminPanelStores/ExamsStore/exam.store';
import { QuestionsStore } from '../../../../AdminPanelStores/QuestionStores/questions.store';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { APIExam } from '../../../../models/certification';
import { APICourseService, CourseService } from '../../../../models/course-service';
import { LookupService } from '../../../../Services/lookup.service';
import { LookupDetail } from '../../../../models/lookup';
import { createdUpdatedOID, courseServiceTypeParentLookup } from '../../../../data/lookUPS';
import { signal } from '@angular/core';

@Component({
  selector: 'app-certification',
  imports: [ButtonComponent, GenericModelComponent, SiteButtonComponent, TranslatePipe, ReactiveFormsModule],
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent {
  certificationStore = inject(CertificationsStore);
  questionStore = inject(QuestionsStore);
  examsStore = inject(ExamsStore);
  private fb = inject(FormBuilder);
  private lookupService = inject(LookupService);

  certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private breadcrumbService = inject(BreadcrumbService);
  certification = this.certificationStore.selectedCertification;
  courseContents = [];
  exams = computed(() => this.examsStore.exams());
  activeTab = signal<'exams' | 'services'>('exams');
  showConfirm: boolean = false;
  deleteExam: APIExam | null = null;

  courseServices = signal<APICourseService[]>([]);
  serviceTypes = signal<LookupDetail[]>([]);
  serviceFormLoading = signal<boolean>(false);
  servicesLoading = signal<boolean>(false);
  editingServiceId = signal<string | null>(null);

  showServiceConfirm: boolean = false;
  deleteService: APICourseService | null = null;

  serviceForm = this.fb.nonNullable.group({
    serviceTypeLookupId: ['', Validators.required],
    titleEn: ['', Validators.required],
    titleAr: ['', Validators.required],
    descriptionEn: [''],
    descriptionAr: [''],
    isActive: [true],
  });

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

    effect(() => {
      const certId = this.certification()?.oid;
      if (certId) {
        this.loadCourseServices(certId);
      }
    });

    this.loadServiceTypes();
  }

  setActiveTab(tab: 'exams' | 'services') {
    this.activeTab.set(tab);
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
    this.showConfirm = true;
    this.deleteExam = exam;
    // this.examsStore.deleteExam(exam.oid);
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


  onConfirmDeleteExam(){
    if (this.deleteExam) {
      this.showConfirm = false;
      this.examsStore.deleteExam(this.deleteExam.oid);
    }
  }

  onCancalDeleteExam() {
    this.showConfirm = false;
  }

  private loadServiceTypes() {
    this.lookupService.getLookupDetailsByParent(courseServiceTypeParentLookup).subscribe({
      next: (types) => this.serviceTypes.set(types ?? []),
      error: () => this.serviceTypes.set([]),
    });
  }

  private loadCourseServices(courseId: string) {
    this.servicesLoading.set(true);
    this.certificationService.getCourseServicesByCourse(courseId).subscribe({
      next: (services) => {
        this.courseServices.set(services ?? []);
        this.servicesLoading.set(false);
      },
      error: () => {
        this.courseServices.set([]);
        this.servicesLoading.set(false);
      },
    });
  }

  startCreateService() {
    this.editingServiceId.set(null);
    this.serviceForm.reset({
      serviceTypeLookupId: '',
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      isActive: true,
    });
  }

  startEditService(service: APICourseService) {
    this.editingServiceId.set(service.oid);
    this.serviceForm.patchValue({
      serviceTypeLookupId: service.serviceTypeLookupId,
      titleEn: service.titleEn ?? service.nameEn ?? service.serviceNameEn ?? '',
      titleAr: service.titleAr ?? service.nameAr ?? service.serviceNameAr ?? '',
      descriptionEn: service.descriptionEn ?? service.detailsEn ?? '',
      descriptionAr: service.descriptionAr ?? service.detailsAr ?? '',
      isActive: service.isActive,
    });
  }

  cancelServiceEdit() {
    this.startCreateService();
  }

  saveService() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const certId = this.certification()?.oid;
    if (!certId) {
      return;
    }

    const value = this.serviceForm.getRawValue();
    const payload: CourseService & Record<string, unknown> = {
      courseOid: certId,
      serviceTypeLookupId: value.serviceTypeLookupId,
      titleEn: value.titleEn,
      titleAr: value.titleAr,
      descriptionEn: value.descriptionEn ?? '',
      descriptionAr: value.descriptionAr ?? '',
      isActive: value.isActive ?? true,
      createdBy: createdUpdatedOID,
      nameEn: value.titleEn,
      nameAr: value.titleAr,
      serviceNameEn: value.titleEn,
      serviceNameAr: value.titleAr,
      detailsEn: value.descriptionEn ?? '',
      detailsAr: value.descriptionAr ?? '',
    };

    this.serviceFormLoading.set(true);
    const editingId = this.editingServiceId();
    const request$ = editingId
      ? this.certificationService.updateCourseService(editingId, payload)
      : this.certificationService.createCourseService(payload);

    request$.subscribe({
      next: () => {
        this.loadCourseServices(certId);
        this.startCreateService();
        this.serviceFormLoading.set(false);
      },
      error: () => {
        this.serviceFormLoading.set(false);
      },
    });
  }

  onDeleteService(service: APICourseService) {
    this.deleteService = service;
    this.showServiceConfirm = true;
  }

  onConfirmDeleteService() {
    if (!this.deleteService) {
      return;
    }

    const certId = this.certification()?.oid;
    this.certificationService.deleteCourseService(this.deleteService.oid).subscribe({
      next: () => {
        this.showServiceConfirm = false;
        this.deleteService = null;
        if (certId) {
          this.loadCourseServices(certId);
        }
      },
      error: () => {
        this.showServiceConfirm = false;
      },
    });
  }

  onCancelDeleteService() {
    this.showServiceConfirm = false;
    this.deleteService = null;
  }

  getServiceTypeName(service: APICourseService): string {
    const match = this.serviceTypes().find((type) => type.oid === service.serviceTypeLookupId);
    return match?.lookupNameEn ?? service.serviceTypeNameEn ?? service.serviceTypeNameAr ?? '-';
  }
}
