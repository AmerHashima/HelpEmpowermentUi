import { isPlatformBrowser, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import * as fabric from 'fabric';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-whiteboard',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule,NgIf],
  templateUrl: './whiteboard.component.html',
  styleUrl: './whiteboard.component.scss',
})
export class WhiteboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private canvas: fabric.Canvas | null = null;

  // Toolbar / drawing state
  brushSize = 5;
  brushColor = '#000000';
  isDrawingMode = true;

  // SSR detection
   isBrowser: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) {
      // Server: do nothing → template will show fallback content
      return;
    }

    // Browser only: delay because modal needs time to become visible/sized
    setTimeout(() => {
      this.initializeCanvas();
    }, 400); // adjust if needed (300–800 ms)
  }

  private initializeCanvas() {
    if (!this.canvasRef?.nativeElement) {
      console.warn('Canvas element not found');
      return;
    }

    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      isDrawingMode: true,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
      width: 800, // fallback
      height: 500, // fallback
    });

    this.forceResizeAndRefresh();
    this.enableDrawingMode();

    // Debug helpers (browser only)
    this.canvas.on('mouse:down', (e) => {
      console.log('mouse:down event:', e);
    });

    this.canvas.on('path:created', (e) => {
      console.log('path:created → stroke finished', e.path);
    });

    this.canvas.requestRenderAll();
  }

  private forceResizeAndRefresh() {
    if (!this.canvas || !this.canvasRef?.nativeElement) return;

    const container = this.canvasRef.nativeElement.parentElement;
    if (container) {
      let width = container.clientWidth - 20;
      let height = container.clientHeight - 20;

      width = Math.max(width, 600);
      height = Math.max(height, 400);

      this.canvas.setDimensions({ width, height });
      this.canvas.calcOffset(); // critical for mouse coordinates
      this.canvas.requestRenderAll();
      this.cdr.detectChanges();
    }
  }

  // ─── Drawing Mode Control ───────────────────────────────────────
  enableDrawingMode() {
    if (!this.canvas) return;
    this.isDrawingMode = true;
    this.canvas.isDrawingMode = true;

    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.color = this.brushColor;
    this.canvas.freeDrawingBrush.width = this.brushSize;

    this.canvas.requestRenderAll();
  }

  disableDrawingMode() {
    if (!this.canvas) return;
    this.isDrawingMode = false;
    this.canvas.isDrawingMode = false;
  }

  // ─── Toolbar Actions ────────────────────────────────────────────
  clearCanvas() {
    if (!this.canvas) return;
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
    this.canvas.requestRenderAll();
  }

  undo() {
    if (!this.canvas || this.canvas._objects.length === 0) return;
    this.canvas.remove(this.canvas._objects[this.canvas._objects.length - 1]);
    this.canvas.requestRenderAll();
  }

  changeColor(color: string) {
    this.brushColor = color;
    if (this.canvas?.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = color;
    }
  }

  changeBrushSize(size: number) {
    this.brushSize = size;
    if (this.canvas?.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.width = size;
    }
  }

  addRect() {
    this.disableDrawingMode();
    if (!this.canvas) return;

    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      fill: 'transparent',
      stroke: '#1976d2',
      strokeWidth: 3,
      width: 220,
      height: 140,
      selectable: true,
      hasControls: true,
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.requestRenderAll();
  }

  addText() {
    this.disableDrawingMode();
    if (!this.canvas) return;

    const text = new fabric.IText('Double-click to edit', {
      left: 180,
      top: 180,
      fontSize: 32,
      fill: '#000000',
      editable: true,
      fontFamily: 'Helvetica',
    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.requestRenderAll();
  }

  exportPNG() {
    if (!this.canvas) return;

    const dataURL = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement('a');
    link.download = `whiteboard_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataURL;
    link.click();
  }

  // ─── Lifecycle ──────────────────────────────────────────────────
  ngOnDestroy() {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
    }
  }
}
