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
  @Input() totalSlots = 0; // number of middle slots
  @Output() middleChange = new EventEmitter<any[]>();

  middleItems: (any | null)[] = [];

  ngOnInit() {
    // Initialize middle slots with null placeholders
    this.middleItems = Array(this.rightItems.length).fill(null);
  }

  dropToMiddle(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Reorder inside middle
      moveItemInArray(this.middleItems, event.previousIndex, event.currentIndex);
    } else {
      // Drag from RIGHT → MIDDLE
      const draggedItem = event.previousContainer.data[event.previousIndex];

      // Remove from right
      event.previousContainer.data.splice(event.previousIndex, 1);

      // Clamp index to existing slots
      const dropIndex = Math.min(event.currentIndex, this.middleItems.length - 1);

      // If slot already has an item, push it back to right
      const existingItem = this.middleItems[dropIndex];
      if (existingItem) {
        this.rightItems.push(existingItem);
      }

      // Place dragged item in the middle slot
      this.middleItems[dropIndex] = draggedItem;
    }

    // Emit only the non-null items
    this.middleChange.emit(this.middleItems.filter(i => i !== null));
  }


  reorderMiddle(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.middleItems, event.previousIndex, event.currentIndex);
    this.middleChange.emit(this.middleItems.filter(i => i !== null));
  }
}

