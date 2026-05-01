import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Webinar } from '../../../../models/webinar';
import { ActiveStatus, createdUpdatedOID, webinarPresentationFormat } from '../../../../data/lookUPS';
import { InputComponent } from '../../../../shared/input/input.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { TextareaComponent } from '../../../../shared/text-area/text-area.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LookupService } from '../../../../Services/lookup.service';
import { Shared } from '../../../../shared/Services/shared/shared';
import { WebinarService } from '../../../../Services/webinar.service';
import { CertificationService } from '../../../../Services/certification.service';
import { APICertification } from '../../../../models/certification';

@Component({
  selector: 'app-webinar-form',
  imports: [InputComponent, SiteButtonComponent, SpkNgSelectComponent, ReactiveFormsModule, TextareaComponent, TranslatePipe],
  templateUrl: './webinar-form.component.html',
  styleUrl: './webinar-form.component.scss'
})
export class WebinarFormComponent implements OnInit {
  private LookupService = inject(LookupService);
  private shared = inject(Shared);
  private webinarService = inject(WebinarService);
  private certificationService = inject(CertificationService);
  isRTL = this.shared.isRtl;
  certifications = signal<APICertification[]>([]);
  oid = input<string>('');
  cancalEvent = output<void>();
  fb = inject(FormBuilder);
  status = ActiveStatus;
  //webinarFormats$ = this.LookupService.getWebinarFormat();
  //timeZone$ = this.LookupService.getTimeZones();
  // specialities = computed(() => this.store.specialities());
  form = this.fb.group({
    webinarName: ['', Validators.required],
    courseOid: ['', Validators.required],
    webinarFormat: [''],
    webinarDate: [''],
    webinarEndTime: [''],
    webinarStartTime: [''],
    timeZone: [''],
    whatsAppLink: [''],
    notes: [''],
    isActive: [false],
  });


  constructor() {
     effect(()=>console.log('certific',this.certifications()));
     effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.webinarService.getWebinar(oid).subscribe({
        next: (webinar) => {
          this.form.patchValue({
            webinarName: webinar.webinarName,
            courseOid: webinar.courseOid,
            webinarDate: webinar.webinarDate?.substring(0, 10) ?? '',
            webinarStartTime: this.extractTime(webinar.webinarStartTime),
            webinarEndTime: this.extractTime(webinar.webinarEndTime),
            whatsAppLink: webinar.whatsAppLink,
            notes: webinar.notes,
            isActive: webinar.isActive,
          });
        },
        error: (err) => console.error('Error loading webinar:', err)
      });
    });

    effect(() => {
      // reserved for future computed effects
    });


    // effect(() => {
    //   const success = this.store.success();
    //   if (success)
    //     this.cancel();
    //   this.store.setSuccess(false);
    // });

  }

  ngOnInit(): void {
    this.loadCertifications();
  }

  private loadCertifications(): void {
    const body = {
      filters: [],
      sort: [{ sortBy: 'courseName', sortDirection: 'asc' }],
      pagination: { getAll: true, pageNumber: 0, pageSize: 100 },
      columns: []
    };

    this.certificationService.search(body).subscribe({
      next: ({ certifications }) => this.certifications.set(certifications),
      error: (err) => {
        console.error('Error loading certifications:', err);
        this.certifications.set([]);
      }
    });
  }
  getInvalidControls(): string[] {
    const controls = this.form.controls;

    return Object.keys(controls).filter(key => {
      const control = controls[key as keyof typeof controls];

      if (control.invalid) {
        console.log('❌ Field:', key);
        console.log('Errors:', control.errors);
        console.log('Value:', control.value);
      }

      return control.invalid;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.getInvalidControls();
      console.log('invalid');
      return;
    }
    if (this.form.valid && !this.oid()) {
      this.createWebinar();
    }
    if (this.form.valid && this.oid()) {
      this.editWebinar();
    }
  }
  createWebinar() {
    this.webinarService.createWebinar(this.getPayload()).subscribe({
      next: () => this.cancel()
    })
  }
  editWebinar() {
    this.webinarService.updateWebinar(this.oid(), this.getPayload()).subscribe({
      next: () => this.cancel()
    })
  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload: Webinar = {
      ...(this.oid() ? { oid: this.oid() } : {}),
      webinarName: v.webinarName ?? '',
      // webinarFormat: v.webinarFormat ?? '',
      webinarFormat: webinarPresentationFormat,
      courseOid: v.courseOid ?? '',
      webinarDate: this.shared.formatDateToISO(v.webinarDate ?? ''),
      webinarEndTime: v.webinarEndTime ?? '',
      webinarStartTime: v.webinarStartTime ?? '',
      // timeZone: v.timeZone ??'',
      timeZone: 'SAR',
      whatsAppLink: v.whatsAppLink ?? '',
      notes: v.notes ?? '',
      isActive: v.isActive ?? true,
      createdBy: createdUpdatedOID,
    };
    return payload;
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.cancalEvent.emit();
  }
  back() {
    this.cancalEvent.emit();
  }

  getFormatLabel() {
    return this.isRTL() ? 'lookupNameAr' : 'lookupNameEn'
  }

  private extractTime(isoString: string | null | undefined): string {
    if (!isoString) return '';
    // handles both "2026-04-15T03:00:00.000Z" and "03:00:00" formats
    const match = isoString.match(/T(\d{2}:\d{2})/);
    if (match) return match[1];
    return isoString.substring(0, 5);
  }
}
