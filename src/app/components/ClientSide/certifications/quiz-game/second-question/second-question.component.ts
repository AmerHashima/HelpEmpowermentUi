import { Component, effect, Input, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

type TableName = 'Table1' | 'Table2';

@Component({
  selector: 'app-second-question',
  imports: [CommonModule, DragDropModule],
  templateUrl: './second-question.component.html',
  styleUrl: './second-question.component.scss'
})
export class SecondQuestionComponent {
  header1 = input.required<string>();
  header2 = input.required<string>();
  @Input() rowsTable1 = 5;
  @Input() rowsTable2 = 10;
  @Input() options: string[] = []; // shared options

   next = input<boolean>(false);
  isCorrect = output<boolean>();
  correctAnswers = input.required<Record<string, string[]>>();

  dropZones1: string[][] = [];
  dropZones2: string[][] = [];

  constructor() {
    // initialize empty drop zones
    this.dropZones1 = Array(this.rowsTable1).fill([]).map(() => []);
    this.dropZones2 = Array(this.rowsTable2).fill([]).map(() => []);

    // Watch for `next` changes
    effect(() => {
      if (this.next()) {
        this.checkAnswer();
      }
    });
  }

  // Predicate: only 1 item per drop zone
  noMoreThanOnePredicate = (drag: any, drop: any) => (drop.data?.length ?? 0) === 0;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }



  private checkAnswer() {
    let allCorrect = true;

    const tables: Record<TableName, string[][]> = {
      Table1: this.dropZones1,
      Table2: this.dropZones2
    };
    for (const [key, expected] of Object.entries(this.correctAnswers())) {

      const [tableNameRaw, rowIndexStr] = key.split('-');
      const tableName = tableNameRaw as TableName;      const rowIndex = Number(rowIndexStr);
      const droppedItems = tables[tableName]?.[rowIndex] ?? [];

      const droppedSorted = [...droppedItems].sort();
      const expectedSorted = [...expected].sort();

      if (
        droppedSorted.length !== expectedSorted.length ||
        !droppedSorted.every((val, i) => val === expectedSorted[i])
      ) {
        allCorrect = false;
        break;
      }
    }

    this.isCorrect.emit(allCorrect);
  }
}
