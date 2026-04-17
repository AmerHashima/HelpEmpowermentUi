import { Component, ElementRef, ViewChild, Input, inject, computed, effect, signal, PLATFORM_ID } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AuthService } from '../../../Services/auth.service';
import { Shared } from '../../../shared/Services/shared/shared';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';

@Component({
  selector: 'app-finish-certification',
  imports: [SiteButtonComponent],
  templateUrl: './finish-certification.component.html',
  styleUrl: './finish-certification.component.scss'
})
export class FinishCertificationComponent {
  private auth=inject(AuthService);
  private shared=inject(Shared);
  @ViewChild('certificate', { static: false }) certificate!: ElementRef;
  userName=computed(()=> this.auth.loggedStudent()?.nameEn);

  finalCert = computed(() => {
    const cert = this.shared.currentCertificationObject();
    const local = this.localCert();
    return this.shared.currentCertificationObject() || this.localCert();
  });

  CERT_CONFIG: Record<string, any> = {
    PMP: {
      hours: 35,
      badge: `PMP® #1870<br>023`,
      codeNumber: 220001
    },
    CAPM: {
      hours: 23,
      badge: `CAPM® #182<br>0429`,
      codeNumber: 230001
    }
  };


  courseName = computed(() => {
    const cert = this.finalCert();
    if (!cert) return '';

    return `${cert.courseDescription} (${cert.courseCode})`;
  });

  hours = computed(() => {
    const cert = this.finalCert();
    if (!cert) return 0;

    return this.CERT_CONFIG[cert.courseCode]?.hours ?? 0;
  });

  badge = computed(() => {
    const cert = this.finalCert();
    if (!cert) return null;

    return this.CERT_CONFIG[cert.courseCode]?.badge ?? null;
  });

  codeNumber = computed(() => {
    const cert = this.finalCert();
    if (!cert) return 0;

    return this.CERT_CONFIG[cert.courseCode]?.codeNumber ?? 0;
  });

  date =computed(() => "30 May 2026");
  private localCert = signal<any>(null);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  constructor() {
    effect(() => {
      if (!this.isBrowser) return;

      const cert = this.shared.currentCertificationObject();

      if (cert) {
        localStorage.setItem('currentCertification', JSON.stringify(cert));
      }
    });
  }
  ngOnInit() {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('currentCertification');

    if (saved) {
      this.localCert.set(JSON.parse(saved));
    }
  }
  // downloadPDF() {
  //   const element = this.certificate.nativeElement;

  //   html2canvas(element, { scale: 3 }).then(canvas => {
  //     const imgData = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF('landscape', 'px', 'a4');
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     pdf.save('certificate.pdf');
  //   });
  // }
  downloadPDF() {
    const element = this.certificate.nativeElement;

    setTimeout(() => {
      html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 1123,
        height: 794
      }).then(canvas => {

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [1123, 794]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, 1123, 794);
        pdf.save('certificate.pdf');
      });
    }, 300);
  }
}
