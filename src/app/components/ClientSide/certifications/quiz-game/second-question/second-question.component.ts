


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
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './second-question.component.html',
  styleUrl: './second-question.component.scss'
})
export class SecondQuestionComponent {

  header1 = input.required<string>();
  header2 = input.required<string>();

  @Input() rowsTable1 = 5;
  @Input() rowsTable2 = 7;
  @Input() options: string[] = [];

  next = input<boolean>(false);
  reset = input<number>(0);

  isCorrect = output<boolean>();
  correctAnswers = input.required<Record<string, string[]>>();

  dropZones1: string[][] = [];
  dropZones2: string[][] = [];
  private originalOptions: string[] = [];

  constructor() {
    // ✅ FIX: prevent shared reference bug
    this.dropZones1 = Array.from({ length: this.rowsTable1 }, () => []);
    this.dropZones2 = Array.from({ length: this.rowsTable2 }, () => []);

    effect(() => {
      if (this.next()) {
        this.checkAnswer();
      }
    });

    effect(() => {
      this.reset();
        this.resetState();
    });
  }


  ngOnInit() {
    this.originalOptions = [...this.options];
  }
  private resetState() {
    this.dropZones1 = Array.from({ length: this.rowsTable1 }, () => []);
    this.dropZones2 = Array.from({ length: this.rowsTable2 }, () => []);

    this.options = [...this.originalOptions];
  }
  // ================= DRAG LOGIC =================

  drop(event: CdkDragDrop<string[]>) {
    const prev = event.previousContainer;
    const curr = event.container;

    const prevData = prev.data;
    const currData = curr.data;

    const isFromOptions = prev.id === 'options';
    const isToOptions = curr.id === 'options';

    // 🔹 Same container → reorder
    if (prev === curr) {
      moveItemInArray(currData, event.previousIndex, event.currentIndex);
      return;
    }

    // ================= OPTIONS → ZONE =================
    if (isFromOptions && !isToOptions) {

      // If zone has item → return it to options
      if (currData.length > 0) {
        const old = currData.pop();
        if (old) prevData.push(old);
      }

      transferArrayItem(prevData, currData, event.previousIndex, 0);
      return;
    }

    // ================= ZONE → OPTIONS =================
    if (!isFromOptions && isToOptions) {
      transferArrayItem(prevData, currData, event.previousIndex, event.currentIndex);
      return;
    }

    // ================= ZONE → ZONE =================
    if (!isFromOptions && !isToOptions) {

      const sourceItem = prevData[event.previousIndex];
      const targetItem = currData[0];

      // remove dragged item from source
      prevData.splice(event.previousIndex, 1);

      if (!targetItem) {
        // empty target
        currData.push(sourceItem);
      } else {
        // swap
        currData[0] = sourceItem;
        prevData.push(targetItem);
      }

      return;
    }
  }

  // ================= VALIDATION =================

  private clean(value: string): string {
    return value
      ?.replace(/\n/g, ' ')
      ?.replace(/\s+/g, ' ')
      ?.trim()
      ?.toLowerCase();
  }

  private checkAnswer() {
    const tables: Record<TableName, string[][]> = {
      Table1: this.dropZones1,
      Table2: this.dropZones2
    };

    let allCorrect = true;

    // 🔥 group expected answers by table
    const expectedByTable: Record<TableName, string[]> = {
      Table1: [],
      Table2: []
    };

    for (const [key, expected] of Object.entries(this.correctAnswers())) {
      const [tableNameRaw] = key.split('-');
      const tableName = tableNameRaw as TableName;

      expectedByTable[tableName].push(...expected);
    }

    // 🔥 collect dropped answers per table
    const droppedByTable: Record<TableName, string[]> = {
      Table1: [],
      Table2: []
    };

    (['Table1', 'Table2'] as TableName[]).forEach(table => {
      tables[table].forEach(zone => {
        if (zone[0]) {
          droppedByTable[table].push(zone[0]);
        }
      });
    });

    // 🔥 compare (ignore order & position)
    (['Table1', 'Table2'] as TableName[]).forEach(table => {

      const expected = expectedByTable[table]
        .map(v => this.clean(v))
        .sort();

      const dropped = droppedByTable[table]
        .map(v => this.clean(v))
        .sort();

      if (
        expected.length !== dropped.length ||
        !expected.every((val, i) => val === dropped[i])
      ) {
        allCorrect = false;
      }
    });

    this.isCorrect.emit(allCorrect);
  }
}
