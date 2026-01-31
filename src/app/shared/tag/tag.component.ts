// src\app\shared\tag\tag.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  title = input.required<string>();

}
