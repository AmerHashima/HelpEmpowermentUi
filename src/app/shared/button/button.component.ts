// src\app\shared\button\button.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  btnLabel = input<string>('');
  buttonType = input<string>('button');
  disabled = input<boolean>(false);
  mainBtn = input<boolean>(true);
  secondaryBtn = input<boolean>(true);

}
