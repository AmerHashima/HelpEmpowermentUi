// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
// import {
//   CdkDragDrop,
//   moveItemInArray
// } from '@angular/cdk/drag-drop';
// import { NgFor } from '@angular/common';

// @Component({
//   selector: 'app-drag-component',
//   imports: [DragDropModule,NgFor],
//   templateUrl: './drag-component.component.html',
//   styleUrl: './drag-component.component.scss'
// })
// export class DragComponentComponent {
//       @Input() leftItems: any[] = [];
//   @Input() rightItems: any[] = [];
//   @Input() savedMiddle: any[] = [];
//   @Input() totalSlots = 0;
//   // @Input() savedMiddle: any[]= [];
//   @Output() middleChange = new EventEmitter<any[]>();
//   @Output() rightItemsChange = new EventEmitter<any[]>();
//   middleItems: (any | null)[] = [];
//   // ngOnInit() {
//   //   this.middleItems = Array(this.rightItems.length).fill(null);
//   // }
//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['leftItems'] || changes['totalSlots']) {
//       const slotCount = this.totalSlots || this.leftItems?.length || 0;
//       if (this.middleItems.length !== slotCount) {
//         this.middleItems = Array(slotCount).fill(null);
//       }
//     }

//     if (changes['savedMiddle'] && this.savedMiddle?.length) {
//       this.middleItems = Array(this.middleItems.length).fill(null); // reset first
//       this.savedMiddle.forEach((item, i) => {
//         if (i < this.middleItems.length) {
//           this.middleItems[i] = item;
//         }
//       });
//       // Optional: emit on restore
//       // this.middleChange.emit([...this.middleItems]);
//     }
//   }

//   dropToMiddle(event: CdkDragDrop<any[]>) {
//     let newMiddle = [...this.middleItems];
//     let newRight = [...this.rightItems];

//     if (event.previousContainer === event.container) {
//       // reorder inside middle
//       moveItemInArray(newMiddle, event.previousIndex, event.currentIndex);
//     } else {
//       const dragged = event.previousContainer.data[event.previousIndex];

//       // remove from right
//       newRight = newRight.filter((_, i) => i !== event.previousIndex);

//       const idx = Math.min(event.currentIndex, newMiddle.length - 1);
//       const displaced = newMiddle[idx];

//       if (displaced) {
//         newRight.push(displaced);
//       }

//       newMiddle[idx] = dragged;
//     }

//     // Final commit
//     this.middleItems = newMiddle;
//     this.rightItems = newRight;

//     this.middleChange.emit(newMiddle);
//     this.rightItemsChange.emit(newRight);
//   }

//   reorderMiddle(event: CdkDragDrop<any[]>) {
//     const newMiddle = [...this.middleItems];
//     moveItemInArray(newMiddle, event.previousIndex, event.currentIndex);

//     this.middleItems = newMiddle;
//     this.middleChange.emit(newMiddle);
//   }
//   // dropToMiddle(event: CdkDragDrop<any[]>) {
//   //   if (event.previousContainer === event.container) {
//   //     moveItemInArray(this.middleItems, event.previousIndex, event.currentIndex);
//   //   } else {
//   //     const draggedItem = event.previousContainer.data[event.previousIndex];

//   //     // Create new array without dragged item
//   //     const updatedRightItems = this.rightItems.filter(
//   //       (_, index) => index !== event.previousIndex
//   //     );

//   //     const dropIndex = Math.min(event.currentIndex, this.middleItems.length - 1);

//   //     const existingItem = this.middleItems[dropIndex];

//   //     if (existingItem) {
//   //       updatedRightItems.push(existingItem);
//   //     }

//   //     this.middleItems[dropIndex] = draggedItem;
//   //     this.rightItemsChange.emit(updatedRightItems);
//   //   }

//   //   this.middleChange.emit([...this.middleItems]);
//   // }

//   // reorderMiddle(event: CdkDragDrop<any[]>) {
//   //   moveItemInArray(this.middleItems, event.previousIndex, event.currentIndex);
//   //   this.middleChange.emit([...this.middleItems]);

//   // }
// }


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
  @Input() leftItems: any[] = [];
  @Input() rightItems: any[] = [];
  @Input() savedMiddle: any[] = [];
  @Input() totalSlots = 0;
  @Input() answersFlag = false;
  @Input() translatedFlag=false
  locked = input<boolean>(false);
  @Output() middleChange = new EventEmitter<any[]>();
  @Output() rightItemsChange = new EventEmitter<any[]>();

  middleItems: (any | null)[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    // Initialize slots based on leftItems or totalSlots
    if (changes['leftItems'] || changes['totalSlots']) {
      const slotCount = this.totalSlots || this.leftItems?.length || 0;
      if (this.middleItems.length !== slotCount) {
        this.middleItems = Array(slotCount).fill(null);
      }
    }

    // Restore saved middle items
    if (changes['savedMiddle'] && this.savedMiddle?.length) {
      // Reset first to avoid leftover items
      this.middleItems = Array(this.middleItems.length).fill(null);
      this.savedMiddle.forEach((item, i) => {
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
    if (event.previousContainer.id === 'middleList') {
      // Clear the slot in middle
      newMiddle[event.previousIndex] = null;

      // Add to right (append to end)
      newRight.push(draggedItem);

      // Optional: insert at drop position instead of append
      // newRight.splice(event.currentIndex, 0, draggedItem);
    }
    // From right → middle
    else if (event.previousContainer.id === 'rightList') {
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
}
