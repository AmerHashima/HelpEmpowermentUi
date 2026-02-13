import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-simple-checkbox',
  standalone:true,
  templateUrl: './simple-checkbox.component.html',
  styleUrl: './simple-checkbox.component.scss'
})
export class SimpleCheckboxComponent {
  id = input<string>('');
  label = input<string>('');
  checked = input<boolean>(false);
  checkedChange = output<boolean>();         

  internalChecked = signal(false);

  constructor() {
    effect(() => this.internalChecked.set(this.checked()));
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.checked;
    this.internalChecked.set(newValue);
    this.checkedChange.emit(newValue);
  }
}
