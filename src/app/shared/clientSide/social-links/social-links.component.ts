import { Component } from '@angular/core';

@Component({
  selector: 'app-social-links',
  standalone: true,
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss'],
})
export class SocialLinksComponent {
  links = [
    {
      title: 'linkedin',
      icon: 'bi bi-linkedin',
      url: 'https://www.linkedin.com/company/help-empowerment/',
    }
  ];

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
