import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../../../Services/auth.service';
import { Shared } from '../../../../shared/Services/shared/shared';
import { DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/input/input.component';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
@Component({
  selector: 'app-profile',
  imports: [NgClass, DatePipe, NgIf, NgFor, NgbNavModule,TranslatePipe,TitleCasePipe,
    SiteButtonComponent,FormsModule,InputComponent,PhoneInputComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private shared = inject(Shared);
  private router = inject(Router);
  private toasting=inject(ToastingMessagesService);
  isRTL=this.shared.isRtl;
  lang=this.shared.lang;
  studentImage="assets/images/profile/person.jpg";

  user: any;

  enrolledCourses = [
    {
      id: 1,
      title: 'PMP® Certification',
      image: 'assets/images/certifications/certfication_1.jpeg',
      lessons: 12,
      duration: '6h 30m',
      progress: 60 // %
    },
    {
      id: 2,
      title: 'CAPM® Certification',
      image: 'assets/images/certifications/certfication_2.jpeg',
      lessons: 8,
      duration: '4h 15m',
      progress: 30
    }
  ];
  exams = [
    {
      id: 1,
      examNumber: 'Exam 1',
      certification: 'pmp',
      status: 'Finished',
      progress: 100,
      successRate: 85
    },
    {
      id: 2,
      examNumber: 'Exam 2',
      certification: 'pmp',
      status: 'Saved',
      progress: 45
    },
    {
      id: 3,
      examNumber: 'Exam 1',
      certification: 'camp',
      status: 'Saved',
      progress: 60
    }
  ];

  credentials = {
    firstName: '',
    lastName: '',
    firstNameAr: '',
    lastNameAr: '',
    username: '',
    email: '',
    mobile: "",
  };

constructor(){
  effect(()=>{
    this.user = this.authService.loggedStudent();
    if (this.user) {
      const names = this.user.nameEn.split(' ');
      const namesAr = this.user.nameAr.split(' ');
      this.credentials = {
        firstName: names[0] || '',
        lastName: names[1] || '',
        firstNameAr: namesAr[0] || '',
        lastNameAr: namesAr[1] || '',
        username: this.user.username || '',
        email: this.user.email || '',
        mobile: this.user.mobile || '',
      };
    }
  })
}


  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.studentImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  goToExam(examId:any){
    // this.router.navigateByUrl(`/${this.lang()}/certifications/${course.courseName.toLowerCase()}/recorded-course`);
  }

  continueCourse(course:any){
    this.router.navigateByUrl(`/${this.lang()}/certifications/${course.courseName.toLowerCase()}/recorded-course`);
  }

  onUpdateInfo(){
    const payload = {
      oid:this.user.oid,
      nameEn: `${this.credentials.firstName} ${this.credentials.lastName}`,
      nameAr: `${this.credentials.firstNameAr} ${this.credentials.lastNameAr}`,
      email: this.credentials.email,
      mobile: this.credentials.mobile,
      username: this.credentials.username,
      isActive: true,
      updatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"

    };

    this.authService.updateStudent(payload.oid,payload).subscribe({
      next: () => {
        // this.toasting.showToast('Account created suffccessfully please login','success');
      },
      error: () => this.toasting.showToast('Failed to create User', 'error')
    })
    console.log('Submitted credentials:', this.credentials);
  }
  }


