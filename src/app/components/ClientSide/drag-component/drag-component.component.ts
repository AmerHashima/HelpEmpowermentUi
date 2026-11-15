

// drag-component.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-drag-component',
  standalone: true,
  imports: [DragDropModule, NgFor],
  templateUrl: './drag-component.component.html',
  styleUrl: './drag-component.component.scss'
})
export class DragComponentComponent implements OnChanges {
  private static nextListInstanceId = 0;

  @Input() leftItems: any[] = [];
  @Input() rightItems: any[] = [];
  @Input() savedMiddle: any[] = [];
  @Input() questionId = '';
  @Input() totalSlots = 0;
  @Input() answersFlag = false;
  @Input() translatedFlag=false;
  @Input() showResult = false;
  @Input() showCorrect = false;
  locked = input<boolean>(false);
  @Output() middleChange = new EventEmitter<any[]>();
  @Output() rightItemsChange = new EventEmitter<any[]>();

  middleItems: (any | null)[] = [];
  readonly middleListId = `matching-middle-${DragComponentComponent.nextListInstanceId}`;
  readonly rightListId = `matching-right-${DragComponentComponent.nextListInstanceId++}`;

  ngOnChanges(changes: SimpleChanges): void {
    // Parent change detection recreates the leftItems array while the learner
    // drags. Reset only when the actual question changes, not on every array
    // reference change, otherwise dropped values disappear immediately.
    const questionChanged = !!changes['questionId'] &&
      changes['questionId'].currentValue !== changes['questionId'].previousValue;

    if (questionChanged || (!this.middleItems.length && (changes['leftItems'] || changes['totalSlots']))) {
      const slotCount = this.totalSlots || this.leftItems?.length || 0;
      this.middleItems = Array(slotCount).fill(null);
    }

    // Restore only on question navigation/initial load. savedMiddle may be a
    // new array during ordinary change detection, but it must not overwrite
    // selections made moments ago.
    if (changes['savedMiddle'] && (questionChanged || !changes['savedMiddle'].previousValue)) {
      // Reset first to avoid leftover items
      this.middleItems = Array(this.middleItems.length).fill(null);
      (this.savedMiddle ?? []).forEach((item, i) => {
        if (i < this.middleItems.length) {
          this.middleItems[i] = item;
        }
      });
      this.middleChange.emit([...this.middleItems]);
    }
  }

  drop(event: CdkDragDrop<(any | null)[]>) {
    if (this.locked()) return;
    if (this.answersFlag || this.translatedFlag) return;

    // Same container → just reorder inside middle
    if (event.previousContainer === event.container) {
      const newMiddle = [...this.middleItems];
      moveItemInArray(newMiddle, event.previousIndex, event.currentIndex);
      this.middleItems = newMiddle;
      this.middleChange.emit(newMiddle);
      return;
    }

    // Different containers → moving between lists
    let newMiddle = [...this.middleItems];
    let newRight = [...this.rightItems];

    const draggedItem = event.previousContainer.data[event.previousIndex];

    // From middle → right
    if (event.previousContainer.id === this.middleListId) {
      // Clear the slot in middle
      newMiddle[event.previousIndex] = null;

      // Add to right (append to end)
      newRight.push(draggedItem);

      // Optional: insert at drop position instead of append
      // newRight.splice(event.currentIndex, 0, draggedItem);
    }
    // From right → middle
    else if (event.previousContainer.id === this.rightListId) {
      // Remove from right
      newRight = newRight.filter((_, i) => i !== event.previousIndex);

      const dropIndex = Math.min(event.currentIndex, newMiddle.length - 1);
      const existingItem = newMiddle[dropIndex];

      // If slot occupied → send existing item back to right
      if (existingItem !== null) {
        newRight.push(existingItem);
      }

      // Place dragged item in middle
      newMiddle[dropIndex] = draggedItem;
    }

    // Apply changes
    this.middleItems = newMiddle;
    this.rightItems = newRight;

    this.middleChange.emit(newMiddle);
    this.rightItemsChange.emit(newRight);
  }

  isCorrectPair(left: any, selected: any): boolean {
    if (!selected) return false;
    return left.correctAnswerOid === selected?.oid;
  }

  isWrongPair(left: any, selected: any): boolean {
    if (!selected) return false;
    return left.correctAnswerOid !== selected?.oid;
  }
}
