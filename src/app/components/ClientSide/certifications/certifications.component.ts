import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GenericTabsComponent } from '../../../shared/generic-tabs/generic-tabs.component';
import { Shared } from '../../../shared/Services/shared/shared';

@Component({
  selector: 'app-certifications',
  imports: [RouterOutlet,GenericTabsComponent],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss'
})
export class CertificationsComponent {
  private shared = inject(Shared);
  lang = this.shared.lang;
  currentCertification=this.shared.currentCertificate;
  tabs = computed(() => [
    {
      header: 'Exam Simulator',
      icon: 'bi bi-journal-check',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/exam-simulator`
    },
    {
      header: 'Recorded Course',
      icon: 'bi bi-play-btn',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/recorded-course`
    },
    {
      header: 'Live Course',
      icon: 'bi bi-camera-video',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/live-course`
    },
    {
      header: 'Webinar',
      icon: 'bi bi-people',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/webinar`
    },
    {
      header: 'Quiz Game',
      icon: 'bi bi-controller',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/quiz-game`
    },
    {
      header: 'Articles',
      icon: 'bi bi-file-text',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/articles`
    },
    {
      header: 'FAQS',
      icon: 'bi bi-question-circle',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/faq`
    },
    {
      header: 'Reviews',
      icon: 'bi bi-star',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/reviews`
    }
  ]);
}
