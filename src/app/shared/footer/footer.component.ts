import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Shared } from '../Services/shared/shared';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslatePipe,RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  private shared=inject(Shared);
  currentLang=this.shared.lang;
  footerImage=computed(()=> {
    if(this.shared.theme() == 'light')
      return 'assets/images/footer/footer.png';
    else return 'assets/images/footer/dark-footer.jpeg'
  })
}

