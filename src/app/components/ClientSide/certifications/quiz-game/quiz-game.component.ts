import { Component, inject, signal } from '@angular/core';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quiz-game',
  imports: [PageBannerComponent,TranslatePipe,SiteButtonComponent],
  templateUrl: './quiz-game.component.html',
  styleUrl: './quiz-game.component.scss'
})
export class QuizGameComponent {
  private shared = inject(Shared);
  private router=inject(Router);
  private route = inject(ActivatedRoute);
  isRTL = this.shared.isRtl;
  courseImage = "assets/images/recordedCourse.jpeg";
  playNow(){
    this.router.navigate(['../quiz'], {
      relativeTo: this.route
    });
  }
}
