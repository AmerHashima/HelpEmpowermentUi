import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  effect,
  input,
  output,
  signal
} from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-matching-table',
  standalone: true,
  imports: [DragDropModule, NgIf, NgFor],
  templateUrl: './matching-table.component.html',
  styleUrls: ['./matching-table.component.scss']
})
export class MatchingTableComponent implements OnChanges {

  @Input() headers: string[] = [];
  @Input() rows: any[] = [];
  @Input() options: any[] = [];
  @Input() correctAnswers: Record<string, string> = {};
  next = input<boolean>(false);
  correct = output<boolean>();
  // one array per row
  dropZones = signal<Record<string, any[]>>({});
  connectedDropLists: string[] = [];
  dropListConnections: string[] = [];
  ngOnChanges(changes: SimpleChanges) {
    if (changes['rows'] && this.rows) {

      const initial: Record<string, any[]> = {};
      this.connectedDropLists = [];

      this.rows.forEach(row => {
        initial[row.id] = [];
        this.connectedDropLists.push(row.id);
      });

      this.dropZones.set(initial);

      // ✅ Build full connection array HERE (not in template)
      this.dropListConnections = ['options', ...this.connectedDropLists];
    }
  }
  constructor() {

    effect(() => {
      if (this.next()) {
        this.checkAnswer();
      }
    });


  }

  drop(event: CdkDragDrop<any[]>, rowId?: string) {

    const zones = { ...this.dropZones() };

    // Dropped into row
    if (rowId) {

      // allow only 1 item
      if (zones[rowId].length >= 1) return;

      const item = event.previousContainer.data[event.previousIndex];

      // remove from previous
      event.previousContainer.data.splice(event.previousIndex, 1);

      zones[rowId].push(item);
    }

    // Dropped back to options
    else {
      const item = event.previousContainer.data[event.previousIndex];
      event.previousContainer.data.splice(event.previousIndex, 1);
      this.options.push(item);
    }

    this.dropZones.set(zones);
  }

  isCorrect(rowId: string) {
    const zone = this.dropZones()[rowId];
    if (!zone?.length) return false;
    return zone[0].id === this.correctAnswers[rowId];
  }

   checkAnswer(): void {
    const result= this.rows.every(row => this.isCorrect(row.id));

    this.correct.emit(result)

  }
}
