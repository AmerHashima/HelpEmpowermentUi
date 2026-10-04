// src\app\components\AdminPanel\certifications\certifications-list\certifications-list.component.ts
import { Component, computed, effect, inject } from '@angular/core';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { CertificationCardComponent } from '../../../../shared/certification-card/certification-card.component';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { Router } from '@angular/router';
import { Certification } from '../../../../models/certification';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { CertificationService } from '../../../../Services/certification.service';

@Component({
  selector: 'app-certifications-list',
  imports: [ButtonComponent, CertificationCardComponent],
  templateUrl: './certifications-list.component.html',
  styleUrl: './certifications-list.component.scss'
})
export class CertificationsListComponent {
  private store = inject(CertificationsStore);
  loading = this.store.loading;
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);
  private certificationService = inject(CertificationService);
  readonly defaultImage = 'assets/images/certifications/certfication_1.jpeg';
  certifications = computed(() => this.store.certifications());

  constructor() {
    effect(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Admin', url: '/admin' },
        { label: 'Certifications', url: '/admin/certifications' }
      ]);
    });
  }


  onAddNewCertification() {
    this.store.setSelectedCertification({} as Certification);
    this.router.navigate(['/admin/certifications/create']);
  }

  openCertificationPage(certification: Certification) {
    this.store.setSelectedCertification(certification);
    this.router.navigate(['/admin/certifications', certification.oid]);
  }

  getCertificationImage(certification: Certification): string {
    return certification.oid && certification.imagePath
      ? this.certificationService.getCertificationImageUrl(certification.oid)
      : this.defaultImage;
  }

}
