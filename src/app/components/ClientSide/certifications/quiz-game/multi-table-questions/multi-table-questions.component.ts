import {
  Component,
  effect,
  Input,
  input,
  output,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-multi-table-questions',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './multi-table-questions.component.html',
  styleUrl: './multi-table-questions.component.scss'
})
export class MultiTableQuestionsComponent implements OnInit {

  @Input() headers: string[] = [];
  @Input() questions: string[] = [];

  options: string[] = [];

  correctAnswers = input.required<Record<string, string[]>>();

  next = input<boolean>(false);
  reset = input<number>(0);
  isCorrect = output<boolean>();

  dropMatrix: string[][][] = [];

  connectedDropLists: string[] = [];
  private originalOptions: string[] = [];
  constructor(private cdr: ChangeDetectorRef) {

    effect(() => {
      if (this.next()) {
        this.checkAnswer();
      }
    });

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
  }

  ngOnInit() {
    this.initializeMatrix();
  }

  private resetState() {
    const rows = this.questions.length;
    const cols = this.headers.length;

    this.dropMatrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => [])
    );

    this.options = [...this.originalOptions];

    this.cdr.detectChanges();
  }
  private initializeMatrix() {
    const rows = this.questions.length;
    const cols = this.headers.length;

    this.dropMatrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => [])
    );

    const ids: string[] = ['optionsList'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ids.push(`cell-${r}-${c}`);
      }
    }

    this.connectedDropLists = ids;
  }



  drop(event: CdkDragDrop<string[]>) {

    const previousContainer = event.previousContainer;
    const currentContainer = event.container;

    const prevData = previousContainer.data;
    const currData = currentContainer.data;

    const draggedItem = prevData[event.previousIndex];

    const isFromOptions = previousContainer.id === 'optionsList';
    const isToOptions = currentContainer.id === 'optionsList';

    const isFromCell = previousContainer.id.startsWith('cell-');
    const isToCell = currentContainer.id.startsWith('cell-');

    // 🔁 SAME CONTAINER (reorder only — mostly options bar)
    if (previousContainer === currentContainer) {
      moveItemInArray(currData, event.previousIndex, event.currentIndex);
      return;
    }

    // ===============================
    // 🔥 OPTIONS → CELL
    // ===============================
    if (isFromOptions && isToCell) {

      // If target cell already has item → return it to options
      if (currData.length > 0) {
        const oldItem = currData[0];
        currData.splice(0, 1);
        this.options.push(oldItem);
      }

      transferArrayItem(prevData, currData, event.previousIndex, 0);
      return;
    }

    // ===============================
    // 🔥 CELL → OPTIONS
    // ===============================
    if (isFromCell && isToOptions) {
      transferArrayItem(prevData, currData, event.previousIndex, event.currentIndex);
      return;
    }

    // ===============================
    // 🔥 CELL → CELL
    // ===============================
    if (isFromCell && isToCell) {

      // Target empty → simple move
      if (currData.length === 0) {
        transferArrayItem(prevData, currData, event.previousIndex, 0);
        return;
      }

      // 🔄 Target filled → SWAP
      const targetItem = currData[0];

      // Replace target with dragged
      currData[0] = draggedItem;

      // Replace source with target
      prevData[event.previousIndex] = targetItem;

      return;
    }

    // Fallback (safety)
    transferArrayItem(prevData, currData, event.previousIndex, event.currentIndex);
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

