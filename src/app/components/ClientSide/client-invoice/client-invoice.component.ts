import { Component } from '@angular/core';
import { InvoiceComponent } from '../invoice/invoice.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Shared } from '../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-client-invoice',
  imports: [InvoiceComponent, RouterLink,SiteButtonComponent,TranslatePipe],
  templateUrl: './client-invoice.component.html',
  styleUrl: './client-invoice.component.scss'
})
export class ClientInvoiceComponent {
  private platformId = inject(PLATFORM_ID);
  private shared=inject(Shared);
  lang=this.shared.lang;
  invoiceData = {

    invoiceNumber: 'INV-2026-001',

    date: new Date(),

    studentName: 'Shaimaa Kamal',

    studentEmail: 'shaimaa@email.com',

    items: [

      {

        description: 'PMP Live Course',

        quantity: 1,

        price: 500

      },

      {

        description: 'Exam Simulator',

        quantity: 1,

        price: 100

      }

    ],

    total: 600

  };

  downloadInvoice() {

    const invoice =

      document.getElementById('invoice-section');

    if (!invoice) return;

    html2canvas(invoice).then(canvas => {

      const pdf = new jsPDF(

        'p',

        'mm',

        'a4'

      );

      const imgData =

        canvas.toDataURL('image/png');

      const width = 190;

      const height =

        canvas.height * width / canvas.width;

      pdf.addImage(

        imgData,

        'PNG',

        10,

        10,

        width,

        height

      );

      pdf.save(

        `Invoice-${this.invoiceData.invoiceNumber}.pdf`

      );

    });
}

  printInvoice() {

    if (!isPlatformBrowser(this.platformId)) {

      return;

    }

    window.print();

  }
  // printInvoice() {

  //   if (!isPlatformBrowser(this.platformId)) {

  //     return;

  //   }

  //   const content =

  //     document.getElementById('invoice-section');

  //   if (!content) {

  //     return;

  //   }

  //   const printWindow = window.open('', '_blank');

  //   if (!printWindow) {

  //     return;

  //   }

  //   printWindow.document.write(`

  //   <html>

  //     <head>

  //       <title>Invoice</title>

  //       <style>

  //         body {

  //           font-family: Arial, sans-serif;

  //           padding: 20px;

  //           background: white;

  //         }

  //       </style>

  //     </head>

  //     <body>

  //       ${content.outerHTML}

  //     </body>

  //   </html>

  // `);

  //   printWindow.document.close();

  //   printWindow.onload = () => {

  //     printWindow.print();

  //     printWindow.close();

  //   };

  // }
}
