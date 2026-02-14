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
    },
    {
      title: 'facebook',
      icon: 'bi bi-facebook',
      url: 'https://www.facebook.com/share/1aLDjaYUHY/',
    },
    {
      title: 'twitter',
      icon: 'bi bi-twitter-x',
      url: 'https://x.com/HelpEmpowe12214',
    },
    {
      title: 'instagram',
      icon: 'bi bi-instagram',
      url: 'https://www.instagram.com/help_empowerment',
    },
    {
      title: 'whatsapp',
      icon: 'bi bi-whatsapp',
      url: 'https://wa.me/966564943997',
    },
  ];

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
