// import { Component, effect, input, output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

// @Component({
//   selector: 'app-question1',
//   imports: [DragDropModule, CommonModule],
//   templateUrl: './question1.component.html',
//   styleUrl: './question1.component.scss'
// })
// export class Question1Component {
//    isCorrect=output<boolean>();
//    next=input<boolean>(false);

//   knowledgeAreas = [
//     'Project Integration Management',
//     'Project Scope Management',
//     'Project Schedule Management',
//     'Project Cost Management',
//     'Project Quality Management',
//     'Project Resource Management',
//     'Project Communications Management',
//     'Project Risk Management',
//     'Project Procurement Management',
//     'Project Stakeholder Management'
//   ];
//   correctAnswers: { [knowledgeArea: string]: string[] } = {
//     'Project Integration Management': ['Develop project charter'],
//     'Project Scope Management': [],
//     'Project Schedule Management': [],
//     'Project Cost Management': [],
//     'Project Quality Management': [],
//     'Project Resource Management': [],
//     'Project Communications Management': [],
//     'Project Risk Management': [],
//     'Project Procurement Management': [],
//     'Project Stakeholder Management': ['Identify Stakeholders']
//     // Add more if you have more processes
//   };
//   dropZones: string[][] = this.knowledgeAreas.map(() => []);

//   options = [
//     'Develop project charter',
//     'Identify Stakeholders'
//     // add more as needed
//   ];


//   constructor() {
//     effect(() => {
//       if (this.next())
//         this.checkAnswers();
//     })
//   }
//   checkAnswers(): void {
//     let allCorrect = true;

//     // Compare each drop zone with expected correct processes
//     this.dropZones.forEach((droppedItems, index) => {
//       const area = this.knowledgeAreas[index];
//       const expected = this.correctAnswers[area] || [];

//       const droppedSorted = [...droppedItems].sort();
//       const expectedSorted = [...expected].sort();

//       if (droppedSorted.length !== expectedSorted.length ||
//         !droppedSorted.every((val, i) => val === expectedSorted[i])) {
//         allCorrect = false;
//       }
//     });

//     const allDropped = this.dropZones.flat();
//     const allCorrectProcesses = Object.values(this.correctAnswers).flat();

//     if (allDropped.length !== allCorrectProcesses.length ||
//       !allCorrectProcesses.every(p => allDropped.includes(p))) {
//       allCorrect = false;
//     }

//     // Emit to parent
//     this.isCorrect.emit(allCorrect);

//     // Optional: console for debugging
//     console.log('Checked answers → correct?', allCorrect);
//   }

//   // Predicate: allow drop ONLY if the target drop zone is EMPTY
//   noMoreThanOnePredicate = (drag: CdkDrag<any>, drop: CdkDropList<any>): boolean => {
//     // 'drop.data' is your array (string[] in this case)
//     return (drop.data?.length ?? 0) === 0;
//   };

//   // drop(event: CdkDragDrop<string[]>) {
//   //   if (event.previousContainer === event.container) {
//   //     // Reordering inside same cell (but since max 1, this won't happen)
//   //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//   //   } else {
//   //     // Optional: extra safety (though predicate already prevents)
//   //     if (event.container.data.length > 0) {
//   //       return;
//   //     }

//   //     transferArrayItem(
//   //       event.previousContainer.data,
//   //       event.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );
//   //   }
//   // }


//   // drop(event: CdkDragDrop<string[]>) {
//   //   if (event.previousContainer === event.container) {
//   //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//   //   } else {
//   //     // Only block transfer if dropping INTO a table drop zone that already has an item
//   //     // (the predicate already mostly prevents this, but keep as extra safety)
//   //     if (event.container.data.length > 0 && event.container !== this.options) {
//   //       return;  // or console.log('Blocked: target already full');
//   //     }

//   //     transferArrayItem(
//   //       event.previousContainer.data,
//   //       event.container.data,
//   //       event.previousIndex,
//   //       event.currentIndex
//   //     );
//   //   }
//   // }


//   drop(event: CdkDragDrop<string[]>) {
//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       transferArrayItem(
//         event.previousContainer.data,
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex
//       );
//     }
//   }
// }



import { Component, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-question1',
  standalone: true,           // recommended in modern Angular
  imports: [DragDropModule, CommonModule],
  templateUrl: './question1.component.html',
  styleUrl: './question1.component.scss'
})
export class Question1Component {
  header1=input.required<string>();
  header2 = input.required<string>();
  questions = input.required<string[]>();
  correctAnswers = input.required<Record<string, string[]>>();
  next = input<boolean>(false);
  connectedLists: string[] = [];
  // Output - emit result when next changes to true
  isCorrect = output<boolean>();

  // Internal state
  dropZones: string[][] = [];
  options: string[] = [];

  constructor() {
    // Initialize dropZones whenever knowledgeAreas changes
    // effect(() => {
    //   const areas = this.questions();
    //   this.dropZones = areas.map(() => []);
    // });
    effect(() => {
      const areas = this.questions();

      // Create drop zones
      this.dropZones = areas.map(() => []);

      // Build connected list IDs
      const ids: string[] = ['options'];

      areas.forEach((_, i) => {
        ids.push(`zone-${i}`);
      });

      this.connectedLists = ids;
    });

    // Initialize options from all correct processes (once on init or when correctAnswers changes)
    effect(() => {
      const correctMap = this.correctAnswers();
      this.options = Object.values(correctMap).flat().sort();
    });

    // React to "next" signal changes
    effect(() => {
      if (this.next()) {
        this.checkAnswers();
      }
    });
  }

  // Predicate: only allow drop if the target zone is empty (max 1 per zone)
  // noMoreThanOnePredicate = (drag: CdkDrag<any>, drop: CdkDropList<any>): boolean => {
  //   return (drop.data?.length ?? 0) === 0;
  // };

  drop(event: CdkDragDrop<string[]>) {

    const prevContainer = event.previousContainer;
    const currContainer = event.container;

    const prevData = prevContainer.data;
    const currData = currContainer.data;

    const draggedItem = prevData[event.previousIndex];

    const isFromOptions = prevContainer.id === 'options';
    const isToOptions = currContainer.id === 'options';

    const isFromZone = !isFromOptions;
    const isToZone = !isToOptions;

    // 🔁 Same container (only relevant for options reorder)
    if (prevContainer === currContainer) {
      moveItemInArray(currData, event.previousIndex, event.currentIndex);
      return;
    }

    // ===============================
    // 🔥 OPTIONS → ZONE (Replace allowed)
    // ===============================
    if (isFromOptions && isToZone) {

      // If zone already has item → return old to options
      if (currData.length > 0) {
        const oldItem = currData[0];
        currData.splice(0, 1);
        this.options.push(oldItem);
      }

      transferArrayItem(prevData, currData, event.previousIndex, 0);
      return;
    }

    // ===============================
    // 🔥 ZONE → OPTIONS
    // ===============================
    if (isFromZone && isToOptions) {
      transferArrayItem(prevData, currData, event.previousIndex, event.currentIndex);
      return;
    }

    // ===============================
    // 🔥 ZONE → ZONE (SWAP ENABLED)
    // ===============================
    if (isFromZone && isToZone) {

      // If target empty → move
      if (currData.length === 0) {
        transferArrayItem(prevData, currData, event.previousIndex, 0);
        return;
      }

      // 🔄 If target filled → SWAP
      const targetItem = currData[0];

      currData[0] = draggedItem;
      prevData[event.previousIndex] = targetItem;

      return;
    }
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }

  private checkAnswers(): void {
    const areas = this.questions();
    const correctMap = this.correctAnswers();

    let allCorrect = true;

    // Check each zone against expected answers for that area
    this.dropZones.forEach((droppedItems, index) => {
      const area = areas[index];
      const expected = correctMap[area] || [];

      const droppedSorted = [...droppedItems].sort();
      const expectedSorted = [...expected].sort();

      if (droppedSorted.length !== expectedSorted.length ||
        !droppedSorted.every((val, i) => val === expectedSorted[i])) {
        allCorrect = false;
      }
    });

    // Optional strict check: all correct processes must be placed somewhere
    const allDropped = this.dropZones.flat();
    const allCorrectProcesses = Object.values(correctMap).flat();

    if (allDropped.length !== allCorrectProcesses.length ||
      !allCorrectProcesses.every(p => allDropped.includes(p))) {
      allCorrect = false;
    }

    this.isCorrect.emit(allCorrect);

    console.log('Question checked → correct?', allCorrect);
  }
}
