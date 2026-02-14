// src\app\components\ClientSide\services\manpower\job-seeker\job-seeker.component.ts
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { InputComponent } from '../../../../../shared/input/input.component';
import { FileUploadComponent } from '../../../../../shared/file-upload/file-upload.component';
import { Shared } from '../../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../../shared/clientSide/site-button/site-button.component';
import { FormsModule } from '@angular/forms';
import { SpkNgSelectComponent } from '../../../../../shared/spk-ng-select/spk-ng-select.component';
import { PhoneInputComponent } from '../../../../../shared/phone/phone.component';

@Component({
  selector: 'app-job-seeker',
  imports: [TranslateModule, TranslatePipe, InputComponent,
    FileUploadComponent, SiteButtonComponent, FormsModule, PhoneInputComponent, SpkNgSelectComponent
  ],  templateUrl: './job-seeker.component.html',
  styleUrl: './job-seeker.component.scss'
})
export class JobSeekerComponent {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  jobFields = [
    { oid: 'job-001', name: 'Software Engineer' },
    { oid: 'job-002', name: 'Frontend Developer' },
    { oid: 'job-003', name: 'Backend Developer' },
    { oid: 'job-004', name: 'Full Stack Developer' },
    { oid: 'job-005', name: 'UI/UX Designer' },
    { oid: 'job-006', name: 'Project Manager' },
    { oid: 'job-007', name: 'QA Engineer' },
  ];
  experiences = [
    { oid: 'exp-001', name: 'Internship' },
    { oid: 'exp-002', name: 'Junior Level (0–2 years)' },
    { oid: 'exp-003', name: 'Mid-Level (2–5 years)' },
    { oid: 'exp-004', name: 'Senior Level (5–8 years)' },
    { oid: 'exp-005', name: 'Lead / Team Lead (8+ years)' },
    { oid: 'exp-006', name: 'Managerial Level' },
    { oid: 'exp-007', name: 'Director / Executive Level' }
  ];
  job = {
    fullname: '',
    field: '',
    email: '',
    phone: "",
    currentPosition: '',
    experience: '',
    currentSalary: '',
    expectedSalary: '',
    attachments: [],
  };

  onPostJob() {
    //console.log(this.job);
  }
}
