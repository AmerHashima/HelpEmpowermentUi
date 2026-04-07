import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-question1',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './question1.component.html',
  styleUrl: './question1.component.scss'
})
export class Question1Component {
  header1=input.required<string>();
  header2 = input.required<string>();
  questions = input.required<string[]>();
  correctAnswers = input.required<Record<string, string[]>>();
  next = input<boolean>(false);
  reset = input<number>(0);

  connectedLists: string[] = [];
  isCorrect = output<boolean>();

  // Internal state
  dropZones: string[][] = [];
  options: string[] = [];
  private originalOptions: string[] = [];

  constructor() {

    effect(() => {
      const areas = this.questions();

      // Create drop zones
      this.dropZones = areas.map(() => []);

      // Build connected list IDs
      const ids: string[] = ['options'];

      areas.forEach((_, i) => {
        ids.push(`zone-${i}`);
      });

      this.connectedLists = ids;
    });

    // Initialize options from all correct processes (once on init or when correctAnswers changes)
    // effect(() => {
    //   const correctMap = this.correctAnswers();
    //   this.options = Object.values(correctMap).flat().sort();
    // });
    effect(() => {
      const correctMap = this.correctAnswers();

      const initial = Object.values(correctMap).flat().sort();

      this.originalOptions = [...initial];
      this.options = [...initial];
    });

    effect(() => {
      this.reset();
      this.resetState();
    });
    // React to "next" signal changes
    effect(() => {
      if (this.next()) {
        this.checkAnswers();
      }
    });
  }


  private resetState() {
    const areas = this.questions();

    // reset drop zones
    this.dropZones = areas.map(() => []);

    this.options.splice(0, this.options.length, ...this.originalOptions);
  }

  drop(event: CdkDragDrop<string[]>) {

    const prevContainer = event.previousContainer;
    const currContainer = event.container;

    const prevData = prevContainer.data;
    const currData = currContainer.data;

    const draggedItem = prevData[event.previousIndex];

    const isFromOptions = prevContainer.id === 'options';
    const isToOptions = currContainer.id === 'options';

    const isFromZone = !isFromOptions;
    const isToZone = !isToOptions;

    // 🔁 Same container (only relevant for options reorder)
    if (prevContainer === currContainer) {
      moveItemInArray(currData, event.previousIndex, event.currentIndex);
      return;
    }

    // ===============================
    // 🔥 OPTIONS → ZONE (Replace allowed)
    // ===============================
    if (isFromOptions && isToZone) {

      // If zone already has item → return old to options
      if (currData.length > 0) {
        const oldItem = currData[0];
        currData.splice(0, 1);
        this.options.push(oldItem);
      }

      transferArrayItem(prevData, currData, event.previousIndex, 0);
      return;
    }

    // ===============================
    // 🔥 ZONE → OPTIONS
    // ===============================
    if (isFromZone && isToOptions) {
      transferArrayItem(prevData, currData, event.previousIndex, event.currentIndex);
      return;
    }

    // ===============================
    // 🔥 ZONE → ZONE (SWAP ENABLED)
    // ===============================
    if (isFromZone && isToZone) {

      // If target empty → move
      if (currData.length === 0) {
        transferArrayItem(prevData, currData, event.previousIndex, 0);
        return;
      }

      // 🔄 If target filled → SWAP
      const targetItem = currData[0];

      currData[0] = draggedItem;
      prevData[event.previousIndex] = targetItem;

      return;
    }
  }



  private checkAnswers(): void {
    const areas = this.questions();
    const correctMap = this.correctAnswers();

    let allCorrect = true;

    // Check each zone against expected answers for that area
    this.dropZones.forEach((droppedItems, index) => {
      const area = areas[index];
      const expected = correctMap[area] || [];

      const droppedSorted = [...droppedItems].sort();
      const expectedSorted = [...expected].sort();

      if (droppedSorted.length !== expectedSorted.length ||
        !droppedSorted.every((val, i) => val === expectedSorted[i])) {
        allCorrect = false;
      }
    });

    // Optional strict check: all correct processes must be placed somewhere
    const allDropped = this.dropZones.flat();
    const allCorrectProcesses = Object.values(correctMap).flat();

    if (allDropped.length !== allCorrectProcesses.length ||
      !allCorrectProcesses.every(p => allDropped.includes(p))) {
      allCorrect = false;
    }

    this.isCorrect.emit(allCorrect);

    console.log('Question checked → correct?', allCorrect);
  }
}
