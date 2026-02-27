import { Component, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-first-question',
  imports: [CommonModule, DragDropModule],
  templateUrl: './first-question.component.html',
  styleUrl: './first-question.component.scss'
})
export class FirstQuestionComponent {

  next=input<boolean>(false);
  isCorrect = output<boolean>();

  sourceItems = signal<string[]>([
    'Executing',
    'Planning',
    'Initiation',
    'Monitoring & Control',
    'Closing'
  ]);

  topZones = signal([
    { items: [] as string[] },
    { items: [] as string[] },
    { items: [] as string[] },
    { items: [] as string[] }
  ]);

  bottomZone = signal<string[]>([]);

  get sourceData() {
    return this.sourceItems();
  }

  get bottomData() {
    return this.bottomZone();
  }
  /* 🔗 connect ALL lists */
  dropListIds = computed(() => {
    const tops = this.topZones().map((_, i) => `top-${i}`);
    return ['source', ...tops, 'bottom'];
  });

  constructor(){
    effect(() => {
      if (this.next()) {
        console.log('in next');
        this.checkAnswers();
      }
    });
  }
  /* allow only one item in zones (NOT in source) */
  singleItemPredicate = (drag: any, drop: any) => {
    if (drop.id === 'source') return true;
    return drop.data.length === 0;
  };

  // drop(event: CdkDragDrop<string[]>) {

  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {

  //     // prevent overwriting in zones
  //     if (
  //       event.container.id !== 'source' &&
  //       event.container.data.length > 0
  //     ) {
  //       return;
  //     }

  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Same container → just reorder
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }

    // ─────────────────────────────────────────────
    // Dropping into a different container
    // ─────────────────────────────────────────────

    const targetContainer = event.container;
    const targetData = targetContainer.data;

    // If dropping back to source → normal transfer
    if (targetContainer.id === 'source') {
      transferArrayItem(
        event.previousContainer.data,
        targetData,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }

    // ─── Dropping into a ZONE (top or bottom) ───
    // If zone already has an item → send old one back to source
    if (targetData.length > 0) {
      const oldItem = targetData[0]; // only one item allowed

      // 1. Remove old item from the zone
      targetData.splice(0, 1);

      // 2. Return old item to sourceItems (add to end — or change position if you want)
      this.sourceItems.update(items => [...items, oldItem]);
      // Alternative: add to beginning
      // this.sourceItems.update(items => [oldItem, ...items]);
    }

    // 3. Now place the new dragged item into the zone
    transferArrayItem(
      event.previousContainer.data,
      targetData,
      event.previousIndex,
      event.currentIndex
    );
  }
  private checkAnswers(): void {
    console.log('checkAnswers');
    const correctOrder = [
      'Initiation',
      'Planning',
      'Executing',
      'Monitoring & Control',
      'Closing'
    ];

    // Get current placed items in order
    const placedItems = [
      ...this.topZones().map(z => z.items[0] || null),
      this.bottomZone()[0] || null
    ];

    // Check if every position has the correct value
    // and nothing is missing / extra
    const isCorrect = placedItems.every((item, index) => item === correctOrder[index]);

    // Optional: more detailed logging for debugging
    console.table({
      expected: correctOrder,
      actual: placedItems,
      isCorrect
    });

    // Emit result to parent
    this.isCorrect.emit(isCorrect);
  }
}
