import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-finish-certification',
  imports: [],
  templateUrl: './finish-certification.component.html',
  styleUrl: './finish-certification.component.scss'
})
export class FinishCertificationComponent {
  @ViewChild('certificate', { static: false }) certificate!: ElementRef;

  @Input() userName!: string;
  @Input() courseName!: string;
  @Input() date!: string;
  @Input() hours!: number;
  @Input() instructor!: string;

  downloadPDF() {
    const element = this.certificate.nativeElement;

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('landscape', 'px', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('certificate.pdf');
    });
  }
}
