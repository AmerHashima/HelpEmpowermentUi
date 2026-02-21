import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-drag-component',
  imports: [DragDropModule,NgFor],
  templateUrl: './drag-component.component.html',
  styleUrl: './drag-component.component.scss'
})
export class DragComponentComponent {
      @Input() leftItems: any[] = [];
  @Input() rightItems: any[] = [];
  @Input() totalSlots = 0;
  @Output() middleChange = new EventEmitter<any[]>();
  @Output() rightItemsChange = new EventEmitter<any[]>();
  middleItems: (any | null)[] = [];
  ngOnInit() {
    this.middleItems = Array(this.rightItems.length).fill(null);
  }

  dropToMiddle(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.middleItems, event.previousIndex, event.currentIndex);
    } else {
      const draggedItem = event.previousContainer.data[event.previousIndex];

      // Create new array without dragged item
      const updatedRightItems = this.rightItems.filter(
        (_, index) => index !== event.previousIndex
      );

      const dropIndex = Math.min(event.currentIndex, this.middleItems.length - 1);

      const existingItem = this.middleItems[dropIndex];

      if (existingItem) {
        updatedRightItems.push(existingItem);
      }

      this.middleItems[dropIndex] = draggedItem;
      this.rightItemsChange.emit(updatedRightItems);
    }

    this.middleChange.emit(this.middleItems.filter(i => i !== null));
  }

  reorderMiddle(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.middleItems, event.previousIndex, event.currentIndex);
    this.middleChange.emit(this.middleItems.filter(i => i !== null));
  }
}

