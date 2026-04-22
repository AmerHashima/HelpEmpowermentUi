// src\app\components\ClientSide\services\manpower\post-vacnacy\post-vacnacy.component.ts
import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { InputComponent } from '../../../../../shared/input/input.component';
import { TextareaComponent } from '../../../../../shared/text-area/text-area.component';
import { FileUploadComponent } from '../../../../../shared/file-upload/file-upload.component';
import { Shared } from '../../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../../shared/clientSide/site-button/site-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { SpkNgSelectComponent } from '../../../../../shared/spk-ng-select/spk-ng-select.component';
import { PhoneInputComponent } from '../../../../../shared/phone/phone.component';

@Component({
  selector: 'app-post-vacnacy',
  standalone:true,
  imports: [TranslateModule,TranslatePipe,InputComponent,TextareaComponent,
    FileUploadComponent, SiteButtonComponent, FormsModule,PhoneInputComponent, SpkNgSelectComponent
  ],
  templateUrl: './post-vacnacy.component.html',
  styleUrl: './post-vacnacy.component.scss'
})
export class PostVacnacyComponent {
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
private shared=inject(Shared);
isRTL=this.shared.isRtl;

  experiences = [
    { oid: 'exp-001', name: 'Internship' },
    { oid: 'exp-002', name: 'Junior Level (0–2 years)' },
    { oid: 'exp-003', name: 'Mid-Level (2–5 years)' },
    { oid: 'exp-004', name: 'Senior Level (5–8 years)' },
    { oid: 'exp-005', name: 'Lead / Team Lead (8+ years)' },
    { oid: 'exp-006', name: 'Managerial Level' },
    { oid: 'exp-007', name: 'Director / Executive Level' }
  ];
  vacancy = {
    fullname: '',
    companyName: '',
    email: '',
    phone: "",
    role: '',
    experience: '',
    jobDescription: '',
    attachments:[],
    notes:""
  };

  onPostVacancy(form:NgForm){
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      this.phoneCmps?.forEach(c => c.validateOnSubmit());
      return;
    }
    //console.log(this.vacancy);
  }
}
