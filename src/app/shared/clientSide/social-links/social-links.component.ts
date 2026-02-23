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
      title: 'youtube',
      icon: 'bi bi-youtube',
      url: 'https://youtube.com/@helpempowerment?si=jtooXnTRBu--1hHh',
    },
    {
      title: 'instagram',
      icon: 'bi bi-instagram',
      url: 'https://www.instagram.com/help_empowerment',
    },
    {
      title: 'tiktok',
      icon: 'bi bi-tiktok',
      url: 'https://www.tiktok.com/@help_empowememt?_r=1&_t=ZS-93pJ6atQF77',
    },
    {
      title: 'snapchat',
      icon: 'bi bi-snapchat',
      url: 'https://www.snapchat.com/add/mahmoud_he123',
    },

  ];

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
