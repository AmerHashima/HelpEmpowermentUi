import { Component, computed, inject, signal } from '@angular/core';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { AuthService } from '../../../../Services/auth.service';
import { CourseTabContentService } from '../../../../Services/course-tab-content.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

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
  private tabService=inject(CourseTabContentService);
  isRTL = this.shared.isRtl;
  courseImage = "assets/images/quizGame/quizGame.jpeg";
  showMustLogin=false;
  tabContent = toSignal(this.tabService.getTab(this.shared.currentCertificate(), 'quiz-game').pipe(catchError(() => of(null))), { initialValue: null });
  tabBanner = computed(() => this.tabContent()?.content.banner[this.isRTL() ? 'ar' : 'en']);
  quizGameContent = computed(() => {
    const cert = this.shared.currentCertificate();
    const key = cert === 'capm' ? 'capm' : cert === 'pmp' ? 'pmp' : null;

    if (!key) {
      const name = cert.toUpperCase();
      return this.isRTL()
        ? { master: `طوّر معرفتك في ${name}`, title: 'من خلال تحديات تفاعلية', description: `ثبّت مفاهيم ${name} بطريقة ممتعة.`, play: 'ابدأ الآن' }
        : { master: `Level up your ${name} knowledge`, title: 'with interactive challenges', description: `Reinforce ${name} concepts in a fun way.`, play: 'Play now' };
    }

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
