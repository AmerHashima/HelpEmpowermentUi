import { Component, effect, Input, input, output, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-multi-table-questions',
  imports: [DragDropModule],
  templateUrl: './multi-table-questions.component.html',
  styleUrl: './multi-table-questions.component.scss'
})
export class MultiTableQuestionsComponent {


  @Input() headers: string[] = [];
  @Input() questions: string[] = [];
 options: string[] = [];

  correctAnswers = input.required<Record<string, string[]>>();
  next = input<boolean>(false);
  isCorrect = output<boolean>();

  dropZones: Record<string, string[][]> = {};
  dropMatrix: string[][][] = [];

  ngOnInit() {
    this.initializeMatrix();
  }

  private initializeMatrix() {
    const rows = this.questions.length;
    const cols = this.headers.length;

    this.dropMatrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => [])
    );
  }


  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      if (this.next()) {
        this.checkAnswer();
      }
    });
    effect(() => {
      const correctMap = this.correctAnswers();
      this.options = Object.values(correctMap).flat().sort();
    });
  }



  noMoreThanOnePredicate = (drag: any, drop: any) =>
    (drop.data?.length ?? 0) === 0;


  drop(event: CdkDragDrop<string[]>) {
    const draggedValue = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
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

    for (const [key, expected] of Object.entries(this.correctAnswers())) {

      const [rowStr, colStr] = key.split('-');
      const row = Number(rowStr);
      const col = Number(colStr);

      const dropped = this.dropMatrix[row]?.[col] ?? [];

      const droppedSorted = [...dropped].sort();
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




