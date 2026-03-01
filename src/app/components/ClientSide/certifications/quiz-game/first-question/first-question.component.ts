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

  drop(event: CdkDragDrop<string[]>) {

    const prevContainer = event.previousContainer;
    const currContainer = event.container;

    const prevData = prevContainer.data;
    const currData = currContainer.data;

    const draggedItem = prevData[event.previousIndex];

    const isFromSource = prevContainer.id === 'source';
    const isToSource = currContainer.id === 'source';

    const isFromZone = prevContainer.id !== 'source';
    const isToZone = currContainer.id !== 'source';

    if (prevContainer === currContainer) {
      moveItemInArray(currData, event.previousIndex, event.currentIndex);
      return;
    }


    if (isFromSource && isToZone) {

      if (currData.length > 0) {
        const oldItem = currData[0];
        currData.splice(0, 1);

        this.sourceItems().push(oldItem);
      }

      transferArrayItem(prevData, currData, event.previousIndex, 0);
      return;
    }

    if (isFromZone && isToSource) {
      transferArrayItem(prevData, currData, event.previousIndex, event.currentIndex);
      return;
    }


    if (isFromZone && isToZone) {

      if (currData.length === 0) {
        transferArrayItem(prevData, currData, event.previousIndex, 0);
        return;
      }

      const targetItem = currData[0];

      currData[0] = draggedItem;
      prevData[event.previousIndex] = targetItem;

      return;
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

    const placedItems = [
      ...this.topZones().map(z => z.items[0] || null),
      this.bottomZone()[0] || null
    ];


    const isCorrect = placedItems.every((item, index) => item === correctOrder[index]);

    this.isCorrect.emit(isCorrect);
  }
}
