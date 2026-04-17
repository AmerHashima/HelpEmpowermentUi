import { Component, inject } from '@angular/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-download-certificate',
  imports: [AccordionComponent],
  templateUrl: './download-certificate.component.html',
  styleUrl: './download-certificate.component.scss'
})
export class DownloadCertificateComponent {
  readonly accordionTitle = 'Course Certification';
  private router=inject(Router);
  private route=inject(ActivatedRoute);
  navigateToDownloadCertification(){
        this.router.navigate(['../','download-certification'], {
          relativeTo: this.route,
    });
  }
}
