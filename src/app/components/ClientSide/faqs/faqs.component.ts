// src\app\components\faqs\faqs.component.ts
import { Component } from '@angular/core';
import { HomeFAQComponent } from '../home/home-faq/home-faq.component';

@Component({
  selector: 'app-faqs',
  imports: [HomeFAQComponent],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FAQsComponent {

}
