import { Component } from '@angular/core';
import { HomeArticlesComponent } from '../../home/home-articles/home-articles.component';
import { HomeFAQComponent } from '../../home/home-faq/home-faq.component';

@Component({
  selector: 'app-certification-faqs',
  imports: [HomeFAQComponent],
  templateUrl: './certification-faqs.component.html',
  styleUrl: './certification-faqs.component.scss'
})
export class CertificationFaqsComponent {

}
