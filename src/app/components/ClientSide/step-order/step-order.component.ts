import { Component, Input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  CdkDragPreview,
  CdkDragPlaceholder,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-step-order',
  imports: [CommonModule,
    CdkDropList,
    CdkDrag,
    CdkDragPreview,
    CdkDragPlaceholder,
    CdkDragHandle,],
  templateUrl: './step-order.component.html',
  styleUrl: './step-order.component.scss'
})
export class StepOrderComponent {
  @Input() title: string = 'Order the following steps:';
  @Input() items: any[] = [];
  @Input() showDragHandle: boolean = true;
  @Input() showPositionNumbers: boolean = true;
  @Input() useLetterLabels: boolean = true; // fallback to A,B,C,... if no label provided

  // Emit the current ordered list whenever it changes
  readonly orderChanged = output<any[]>();

  // Computed current order (for display or parent usage)
  readonly currentOrder = computed(() => [...this.items]);

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.orderChanged.emit([...this.items]); // emit copy to be safe
  }

  // Helper: fallback label if not provided
  getDisplayLabel(item: any, index: number): string {
    if (item.label) return item.label;
    if (this.useLetterLabels) {
      return String.fromCharCode(65 + index); // A=65, B=66, ...
    }
    return (index + 1).toString();
  }

  trackById(index: number, item: any): string | number {
    return item.id ?? index;
  }
}
