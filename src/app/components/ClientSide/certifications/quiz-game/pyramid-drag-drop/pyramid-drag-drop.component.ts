import { Component, input, output, OnInit, effect } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pyramid-drag-drop',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './pyramid-drag-drop.component.html',
  styleUrls: ['./pyramid-drag-drop.component.scss']
})
export class PyramidDragDropComponent implements OnInit {

  questions = input.required<string[]>();
  options = input.required<string[]>();
  correctAnswers = input.required<Record<string, string[]>>();
  next = input<boolean>(false);

  isCorrect = output<boolean>();

  sourceOptions: string[] = [];

  level1: string[] = [];
  level2: string[] = [];
  level3: string[] = [];
  level4: string[] = [];


  constructor() {

    effect(() => {
      if (this.next()) {
        this.checkAnswer();
      }
    });

  }


  ngOnInit() {
    this.sourceOptions = [...this.options()];
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
