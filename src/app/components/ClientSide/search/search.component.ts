import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [TranslatePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private route = inject(ActivatedRoute);

  query = toSignal(

    this.route.queryParams.pipe(

      map(params => params['q'] || '')

    ),

    { initialValue: '' }

  );
}
