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
      url: 'https://www.linkedin.com/',
    },
    {
      title: 'facebook',
      icon: 'bi bi-facebook',
      url: 'https://www.facebook.com',
    },
    {
      title: 'twitter',
      icon: 'bi bi-twitter-x',
      url: 'https://x.com/',
    },
    {
      title: 'instagram',
      icon: 'bi bi-instagram',
      url: 'https://www.instagram.com/',
    },
    {
      title: 'youtube',
      icon: 'bi bi-youtube',
      url: 'https://www.youtube.com/',
    },
  ];

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
