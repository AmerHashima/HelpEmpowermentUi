import { Component, effect, inject, input, output } from '@angular/core';
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

@Component({
  selector: 'app-webinar-form',
  imports: [InputComponent,SiteButtonComponent,SpkNgSelectComponent,ReactiveFormsModule,TextareaComponent,TranslatePipe],
  templateUrl: './webinar-form.component.html',
  styleUrl: './webinar-form.component.scss'
})
export class WebinarFormComponent {
  private LookupService= inject(LookupService);
  private shared = inject(Shared);
  private webinarService=inject(WebinarService);
  isRTL=this.shared.isRtl;
  certifications=this.shared.certifications;
oid=input<string>('');
  cancalEvent=output<void>();
  fb = inject(FormBuilder);
  status = ActiveStatus;
  webinarFormats$ = this.LookupService.getWebinarFormat();
  timeZone$=this.LookupService.getTimeZones();
  // specialities = computed(() => this.store.specialities());
  form = this.fb.group({
    webinarName: ['', Validators.required],
    courseOid: ['', Validators.required],
    webinarFormat: ['', Validators.required],
    webinarDate: ['', Validators.required],
    webinarEndTime: ['', Validators.required],
    webinarStartTime: ['', Validators.required],
    timeZone: ['', Validators.required],
    whatsAppLink: ['', Validators.required],
    notes: [''],
    isActive: [false, Validators.required],
  });


  constructor() {

    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      // this.store.getBranch(oid);
    });

    effect(() => {
      // const speciality = this.store.selectedSpeciality();
      // // const branch = this.store.selectedItem();
      // if (branch) {
      //   this.form.patchValue({
      //     code: branch.code,
      //     name: branch.name,
      //     state: branch.state ? branch.state : null,
      //     country: branch.country,
      //     city: branch.city,
      //     postalCode: branch.postalCode,
      //     address: branch.address,
      //     isActive: branch.isActive,
      //   });
      // }
    });


    // effect(() => {
    //   const success = this.store.success();
    //   if (success)
    //     this.cancel();
    //   this.store.setSuccess(false);
    // });

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
      next:()=> this.cancel()
    })
  }
  editWebinar() {
    this.webinarService.updateWebinar(this.oid(),this.getPayload()).subscribe({
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
      webinarDate: this.shared.formatDateToISO(v.webinarDate ?? '') ,
      webinarEndTime: v.webinarEndTime ?? '',
      webinarStartTime: v.webinarStartTime ?? '',
      // timeZone: v.timeZone ??'',
      timeZone:'SAR',
      whatsAppLink: v.whatsAppLink??'',
      notes: v.notes??'',
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

  getFormatLabel(){
    return this.isRTL() ? 'lookupNameAr' : 'lookupNameEn'
  }
}
