import { Component, computed, inject, signal } from '@angular/core';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-quiz-game',
  imports: [PageBannerComponent,TranslatePipe,SiteButtonComponent,GenericModelComponent],
  templateUrl: './quiz-game.component.html',
  styleUrl: './quiz-game.component.scss'
})
export class QuizGameComponent {
  private shared = inject(Shared);
  private router=inject(Router);
  private route = inject(ActivatedRoute);
  private auth=inject(AuthService);
  isRTL = this.shared.isRtl;
  courseImage = "assets/images/recordedCourse.jpeg";
  showMustLogin=false;
  quizGameContent = computed(() => {
    const cert = this.shared.currentCertificate();
    const key = cert === 'capm' ? 'capm' : 'pmp';

    return {
      master: `quizGame.${key}.master`,
      title: `quizGame.${key}.title`,
      description: `quizGame.${key}.description`,
      play: `quizGame.${key}.play`
    };
  });
  playNow(){
    if(!this.auth.studentToken()){
      this.showMustLogin=true;
      return;
    }
    this.router.navigate(['../quiz'], {
      relativeTo: this.route
    });
  }
}
