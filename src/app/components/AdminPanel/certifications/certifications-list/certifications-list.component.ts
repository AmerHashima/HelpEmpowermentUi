import { Component, computed, inject } from '@angular/core';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { CertificationCardComponent } from '../../../../shared/certification-card/certification-card.component';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { Router } from '@angular/router';
import { Certification } from '../../../../models/certification';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-certifications-list',
  imports: [ButtonComponent, CertificationCardComponent,JsonPipe],
  templateUrl: './certifications-list.component.html',
  styleUrl: './certifications-list.component.scss'
})
export class CertificationsListComponent {
  private store = inject(CertificationsStore);
  private router = inject(Router);
  certifications = computed(() => this.store.certifications());


  onAddNewCertification() {
    this.store.setSelectedCertification({} as Certification);
    this.router.navigate(['/admin/certifications/create']);
  }

  openCertificationPage(certification: Certification) {
    this.store.setSelectedCertification(certification);
    this.router.navigate(['/admin/certifications', certification.oid]);
  }

}
