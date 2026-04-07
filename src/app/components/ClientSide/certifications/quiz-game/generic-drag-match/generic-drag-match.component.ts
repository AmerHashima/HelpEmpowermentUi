import { Component, input, output, effect, computed } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-generic-drag-match',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './generic-drag-match.component.html',
  styleUrls: ['./generic-drag-match.component.scss']
})
export class GenericDragMatchComponent {

  next = input<boolean>(false);
  isCorrect = output<boolean>();
  level = input<string>('');
  questions = input.required<string[]>();
  type = input.required<string>();
  options = input.required<string[]>();
  correctAnswers = input.required<Record<string, string[]>>();
  dropSlotsPerQuestion = input<number>(1);
  reset = input<number>(0);
  sourceOptions: string[] = [];
  // droppedItems: string[][] = [];
droppedItems:string[][][]=[];
  readonly isRowLayout = computed(() =>
    this.level() === 'level 17' || this.level() === 'level 18'
  );
  private originalOptions: string[] = [];
  constructor() {

    // effect(() => {
    //   const questions = this.questions();
    //   const options = this.options();
    //   const slots = this.dropSlotsPerQuestion();

    //   if (!questions || !options) return;

    //   this.sourceOptions = [...options];

    //   // Build structure dynamically
    //   this.droppedItems = questions.map(() =>
    //     Array.from({ length: slots }, () => [])
    //   );
    // });

    effect(() => {
      const questions = this.questions();
      const options = this.options();
      const slots = this.dropSlotsPerQuestion();

      if (!questions || !options) return;

      this.originalOptions = [...options];

      this.sourceOptions = [...options];

      this.droppedItems = questions.map(() =>
        Array.from({ length: slots }, () => [])
      );
    });

    effect(() => {
      if (this.next()) {
        this.checkAnswer();
      }
    });

    effect(() => {
      this.reset();

      this.resetState();
    })
  }

  private resetState() {
    const questions = this.questions();
    const slots = this.dropSlotsPerQuestion();

    this.sourceOptions = [...this.originalOptions];

    this.droppedItems = questions.map(() =>
      Array.from({ length: slots }, () => [])
    );
  }

  

  // ngOnInit() {
  //   this.sourceOptions = [...this.options()];

  //   // Create one drop array per question
  //   this.droppedItems = this.questions().map(() => []);
  // }

  drop(
    event: CdkDragDrop<string[]>,
    questionIndex?: number,
    slotIndex?: number
  ) {

    const prev = event.previousContainer.data;
    const curr = event.container.data;

    // Same container reorder
    if (event.previousContainer === event.container) {
      moveItemInArray(curr, event.previousIndex, event.currentIndex);
      return;
    }

    // Dropping into a specific slot
    if (questionIndex !== undefined && slotIndex !== undefined) {

      // Only 1 item per slot
      if (curr.length > 0) {
        const existing = curr[0];
        curr.splice(0, 1);
        prev.push(existing);
      }

      transferArrayItem(prev, curr, event.previousIndex, 0);
      return;
    }

    // Dropping back to options
    transferArrayItem(prev, curr, event.previousIndex, event.currentIndex);
  }

  // checkAnswer() {

  //   const answers = this.correctAnswers();
  //   let correct = true;

  //   this.droppedItems.forEach((slots, qIndex) => {

  //     const key = `level${qIndex + 1}`;
  //     const flatSlots = slots.flat(); // flatten 2 slots into 1 array

  //     if (JSON.stringify(flatSlots) !== JSON.stringify(answers[key])) {
  //       correct = false;
  //     }
  //   });

  //   this.isCorrect.emit(correct);
  // }

  checkAnswer() {
    const answers = this.correctAnswers();
    let correct = true;

    this.droppedItems.forEach((slots, qIndex) => {
      const key = `level${qIndex + 1}`;
      const flatSlots = slots.flat();

      const expected = answers[key] ?? [];

      // 🎯 Ignore order for level 14 & 15
      if (this.level() === 'level 13' || this.level() === 'level 14') {

        const sortedDropped = [...flatSlots].sort();
        const sortedExpected = [...expected].sort();

        if (
          sortedDropped.length !== sortedExpected.length ||
          !sortedDropped.every((val, i) => val === sortedExpected[i])
        ) {
          correct = false;
        }

      } else {
        // ✅ Order matters (default behavior)
        if (JSON.stringify(flatSlots) !== JSON.stringify(expected)) {
          correct = false;
        }
      }
    });

    this.isCorrect.emit(correct);
  }

  private reorderLevels = [
    'level 12',
    'level 13',
    'level 14',
    'level 17',
    'level 18'
  ];

  shouldReorder(): boolean {
    return this.reorderLevels.includes(this.level());
  }
}
