// import { Component, effect, input, output } from '@angular/core';

// @Component({
//   selector: 'app-exam-timer',
//   standalone:true,
//   imports: [],
//   templateUrl: './exam-timer.component.html',
//   styleUrl: './exam-timer.component.scss'
// })
// export class ExamTimerComponent {
//   duration = input<number>(60);
//   key = input.required<string>();

//   timeUp = output<void>();

//   remaining = 0;
//   interval: any;

//   constructor() {

//     effect(() => {

//       const currentKey = this.key();   // 👈 track key change
//       const duration = this.duration();

//       this.resetTimer(duration);

//     });

//   }

//   resetTimer(duration: number) {

//     clearInterval(this.interval);

//     this.remaining = duration;

//     this.interval = setInterval(() => {

//       this.remaining--;

//       if (this.remaining <= 0) {

//         clearInterval(this.interval);
//         this.timeUp.emit();

//       }

//     }, 1000);

//   }

//   get display() {
//     const m = Math.floor(this.remaining / 60);
//     const s = this.remaining % 60;
//     return `${m}:${s.toString().padStart(2, '0')}`;
//   }

//   get danger() {
//     return this.remaining <= 10;
//   }

//   ngOnDestroy() {
//     clearInterval(this.interval);
//   }

// }


import { Component, input, output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-exam-timer',
  standalone:true,
  imports: [],
  templateUrl: './exam-timer.component.html',
  styleUrl: './exam-timer.component.scss'
})
export class ExamTimerComponent implements OnInit, OnChanges {

  duration = input<number>(60);

  timeUp = output<void>();
  tick = output<number>();

  remaining = 0;
  interval: any;

  ngOnInit() {
    this.startTimer(this.duration());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['duration'] && !changes['duration'].firstChange) {
      this.remaining = changes['duration'].currentValue;
    }
  }

  startTimer(duration: number) {
    clearInterval(this.interval);

    this.remaining = duration;

    this.interval = setInterval(() => {
      this.remaining--;

      this.tick.emit(this.remaining); // ✅ SEND TO PARENT

      if (this.remaining <= 0) {
        clearInterval(this.interval);
        this.timeUp.emit();
      }
    }, 1000);
  }

  get display() {
    const m = Math.floor(this.remaining / 60);
    const s = this.remaining % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  get danger() {
    return this.remaining <= 60; // 🔥 better UX (last minute)
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
