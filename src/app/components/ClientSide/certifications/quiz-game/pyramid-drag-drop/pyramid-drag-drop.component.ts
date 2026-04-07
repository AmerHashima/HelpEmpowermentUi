import { Component, input, output, OnInit, effect } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pyramid-drag-drop',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './pyramid-drag-drop.component.html',
  styleUrls: ['./pyramid-drag-drop.component.scss']
})
export class PyramidDragDropComponent  {

  questions = input.required<string[]>();
  options = input.required<string[]>();
  correctAnswers = input.required<Record<string, string[]>>();
  next = input<boolean>(false);
  reset = input<number>(0);
    isCorrect = output<boolean>();

  sourceOptions: string[] = [];

  level1: string[] = [];
  level2: string[] = [];
  level3: string[] = [];
  level4: string[] = [];
  private originalOptions: string[] = [];

  constructor() {

    effect(() => {
      if (this.next()) {
        this.checkAnswer();
      }
    });

    effect(() => {
      this.reset();
      this.resetState();
    });

    effect(() => {
      const opts = this.options();

      if (!opts) return;

      this.originalOptions = [...opts];
      this.sourceOptions = [...opts];
    });

  }


  // ngOnInit() {
  //   this.sourceOptions = [...this.options()];
  // }

  // ngOnInit() {
  //   const initial = [...this.options()];
  //   this.originalOptions = [...initial];
  //   this.sourceOptions = [...initial];
  // }

  private resetState() {
    // reset pyramid levels
    this.level1 = [];
    this.level2 = [];
    this.level3 = [];
    this.level4 = [];

    // reset options
    this.sourceOptions = [...this.originalOptions];
  }

  drop(event: CdkDragDrop<string[]>) {

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

  checkAnswer() {
    const result =
      JSON.stringify(this.level1) === JSON.stringify(this.correctAnswers()['level1']) &&
      JSON.stringify(this.level2) === JSON.stringify(this.correctAnswers()['level2']) &&
      JSON.stringify(this.level3) === JSON.stringify(this.correctAnswers()['level3']) &&
      JSON.stringify(this.level4) === JSON.stringify(this.correctAnswers()['level4']);

    this.isCorrect.emit(result);
  }
}
