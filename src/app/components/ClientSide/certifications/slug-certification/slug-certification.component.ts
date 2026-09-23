import { Component, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-slug-certification',
  imports: [RouterOutlet],
  templateUrl: './slug-certification.component.html',
  styleUrl: './slug-certification.component.scss'
})
export class SlugCertificationComponent {
  private shared = inject(Shared);
  constructor(private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if(slug)
      this.shared.currentCertificate.set(slug?.toLowerCase())
    });
  }
  ngOnDestroy(): void {
    this.shared.currentCertificate.set('');
  }
}
