// src\app\shared\file-upload\file-upload.component.ts
import {
  Component,
  ViewChild,
  Input,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { FilePondModule } from 'ngx-filepond';
import * as FilePond from 'filepond';

import { FilePondFile, FilePondInitialFile } from 'filepond';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FilePondModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {

  @ViewChild('myPond') myPond!: any;

  @Input() multiple = true;
  @Input() label = 'Drop files here to Upload...';

  pondOptions: FilePond.FilePondOptions = {};
  pondFiles: FilePond.FilePondOptions['files'] = [];

  private disabled = false;

  /* ===== CVA callbacks ===== */
  private onChange: (value: File[]) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    this.updateOptions();
  }

  ngOnChanges() {
    this.updateOptions();
  }

  /* ================== CVA ================== */

  writeValue(files: File[] | null): void {
    if (!files || !files.length) {
      this.pondFiles = [];
      this.myPond?.removeFiles();
      return;
    }

    this.pondFiles = files.map(
      (file): FilePondInitialFile => ({
        source: file as any,
        options: { type: 'local' }
      })
    );
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.updateOptions();
  }

  /* ============== FilePond ================= */

  private updateOptions() {
    this.pondOptions = {
      allowMultiple: this.multiple,
      labelIdle: this.label,
      disabled: this.disabled
    };
  }

  pondHandleInit() {
    console.log('FilePond initialized');
  }

  pondHandleAddFile() {
    this.emitToForm();
  }

  pondHandleRemoveFile() {
    this.emitToForm();
  }

  private emitToForm() {
    const files: File[] = this.myPond
      ?.getFiles()
      .map((f: FilePondFile) => f.file) || [];

    this.onChange(files);
    this.onTouched();
  }

  /* ===== Public API (optional) ===== */

  clearFiles() {
    this.myPond?.removeFiles();
    this.onChange([]);
  }

  getFiles(): FilePondFile[] {
    return this.myPond?.getFiles() || [];
  }

  uploadAll(endPoint: string) {
    const files = this.getFiles();
    if (!files.length) return;

    const formData = new FormData();
    files.forEach(f => formData.append('files', f.file));
    console.log('on load');
    // this.http.post('/api/upload', formData).subscribe(...)
  }
}
