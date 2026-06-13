import { Component, effect, inject, input, output } from '@angular/core';
import { LookupService } from '../../../../Services/lookup.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActiveStatus, announcementLookUpId, createdUpdatedOID } from '../../../../data/lookUPS';
import { TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TextareaComponent } from '../../../../shared/text-area/text-area.component';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';

@Component({
  selector: 'app-announcement-form',
  imports: [TranslatePipe,SiteButtonComponent,InputComponent,TextareaComponent,SpkNgSelectComponent,ReactiveFormsModule],
  templateUrl: './announcement-form.component.html',
  styleUrl: './announcement-form.component.scss'
})
export class AnnouncementFormComponent {
  private lookupService = inject(LookupService);
  oid = input<string>('');
  cancalEvent = output<void>();
  fb = inject(FormBuilder);
  status = ActiveStatus;
  form = this.fb.group({
    title: ['', Validators.required],
    message: ['', Validators.required],
    isActive: [false],
    icon: ['', Validators.required]
  });

  iconOptions = [

    {

      label: 'Megaphone',

      value: 'bi-megaphone-fill',

      icon: 'bi bi-megaphone-fill'

    },

    {

      label: 'Bell',

      value: 'bi-bell-fill',

      icon: 'bi bi-bell-fill'

    },

    {

      label: 'Fire',

      value: 'bi-fire',

      icon: 'bi bi-fire'

    }

  ];

  constructor() {
    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.lookupService.getLookupDetail(oid).subscribe({
        next: (announcement) => {
          this.form.patchValue({
            title: announcement.lookupValue,
            message: announcement.lookupNameEn,
            isActive: announcement.isActive,
            icon:announcement.lookupNameAr
          });
        },
        error: (err) => console.error('Error loading:', err)
      });
    });



  }


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid && !this.oid()) {
      this.createAnnouncement();
    }
    if (this.form.valid && this.oid()) {
      this.editAnnouncement();
    }
  }
  createAnnouncement() {
    this.lookupService.createLookupDetail(this.getPayload()).subscribe({
      next: () => {
        this.cancel();
        // this.webinarService.reloadWebiinars();
      }
    })
  }
  editAnnouncement() {
    this.lookupService.updateLookupDetail(this.oid(), this.getPayload()).subscribe({
      next: () => {
        this.cancel();
        // this.webinarService.reloadWebiinars(this.webinarService.pageNumber());
      }
    })
  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload = {
      ...(this.oid() ? { oid: this.oid() } : {}),

      lookupHeaderId: announcementLookUpId,
      lookupValue: v.title,
      lookupNameEn: v.message,
      lookupNameAr: v.icon,
      orderNo: 0,
      isActive: v.isActive ?? true,
      ...(this.oid() ? { } : { createdBy: createdUpdatedOID }),
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


}
