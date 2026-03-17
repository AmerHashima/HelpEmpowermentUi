// src\app\shared\generic-model\generic-model.component.ts
import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-generic-modal',
  imports: [NgClass,TranslatePipe],
  templateUrl: './generic-model.component.html',
  styleUrl: './generic-model.component.scss'
})
export class GenericModelComponent {
  isOpen = input.required<boolean>();
  title = input<string>('Modal');
  isOpenChange = output<boolean>({ alias: 'isOpenChange' });
  close = output<void>();
}
