import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { evaluate } from 'mathjs';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonToggleModule,
    NgIf,
    NgFor
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {

  expression = '';
  result = '';
  history: string[] = [];
  memory = 0;
  angleMode: 'DEG' | 'RAD' = 'RAD';

  /* ---------------------------------------------------
     Helpers
  --------------------------------------------------- */

  private normalizeExpression(expr: string): string {
    return expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi');
  }

  private convertDegIfNeeded(expr: string): string {
    if (this.angleMode === 'DEG') {
      expr = expr
        .replace(/sin\(([^)]+)\)/g, 'sin(($1) * pi / 180)')
        .replace(/cos\(([^)]+)\)/g, 'cos(($1) * pi / 180)')
        .replace(/tan\(([^)]+)\)/g, 'tan(($1) * pi / 180)')
        .replace(/asin\(([^)]+)\)/g, '(asin($1) * 180 / pi)')
        .replace(/acos\(([^)]+)\)/g, '(acos($1) * 180 / pi)')
        .replace(/atan\(([^)]+)\)/g, '(atan($1) * 180 / pi)');
    }
    return expr;
  }

  private formatResult(value: any): string {
    if (!Number.isFinite(value)) return 'Error';
    return Number(value).toFixed(10).replace(/\.?0+$/, '');
  }

  /* ---------------------------------------------------
     Basic Controls
  --------------------------------------------------- */

  append(value: string) {
    if (this.result && /[0-9.]/.test(value)) {
      this.expression = '';
      this.result = '';
    }

    this.expression += value;
  }

  insertFunction(func: string) {
    this.append(`${func}(`);
  }

  insertConstant(constant: string) {
    this.append(constant);
  }

  clear() {
    this.expression = '';
    this.result = '';
  }

  allClear() {
    this.expression = '';
    this.result = '';
    this.history = [];
  }

  backspace() {
    this.expression = this.expression.slice(0, -1);
  }

  /* ---------------------------------------------------
     Calculation
  --------------------------------------------------- */

  calculate() {
    if (!this.expression) return;

    try {
      let expr = this.normalizeExpression(this.expression);
      expr = this.convertDegIfNeeded(expr);

      const res = evaluate(expr);
      this.result = this.formatResult(res);

      if (this.result !== 'Error') {
        this.history.unshift(`${this.expression} = ${this.result}`);
        if (this.history.length > 10) this.history.pop();
      }

    } catch (error) {
      console.error(error);
      this.result = 'Error';
    }
  }

  /* ---------------------------------------------------
     Memory
  --------------------------------------------------- */

  memoryClear() {
    this.memory = 0;
  }

  memoryRecall() {
    this.append(this.memory.toString());
  }

  memoryAdd() {
    try {
      const expr = this.normalizeExpression(this.expression || '0');
      this.memory += evaluate(expr);
    } catch { }
  }

  memorySubtract() {
    try {
      const expr = this.normalizeExpression(this.expression || '0');
      this.memory -= evaluate(expr);
    } catch { }
  }

  /* ---------------------------------------------------
     Keyboard Support
  --------------------------------------------------- */

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {

    const key = event.key;

    if ((key >= '0' && key <= '9') ||
      ['+', '-', '*', '/', '.', '(', ')', '^'].includes(key)) {

      this.append(
        key === '*' ? '×' :
          key === '/' ? '÷' :
            key
      );
    }

    if (key === 'Enter' || key === '=') {
      event.preventDefault();
      this.calculate();
    }

    if (key === 'Backspace') {
      this.backspace();
    }

    if (key === 'Escape') {
      this.clear();
    }
  }
}
