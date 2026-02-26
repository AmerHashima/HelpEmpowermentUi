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

  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {

      // prevent overwriting in zones
      if (
        event.container.id !== 'source' &&
        event.container.data.length > 0
      ) {
        return;
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
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
