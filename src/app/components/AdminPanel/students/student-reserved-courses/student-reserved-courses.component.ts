// src\app\components\AdminPanel\students\student-reserved-courses\student-reserved-courses.component.ts
import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { StudentService } from '../../../../Services/student-service.service';
import { APIStudentCourse } from '../../../../models/student-course';

@Component({
    selector: 'app-student-reserved-courses',
    imports: [CommonModule, RouterLink],
    templateUrl: './student-reserved-courses.component.html',
    styleUrl: './student-reserved-courses.component.scss'
})
export class StudentReservedCoursesComponent {
    private route = inject(ActivatedRoute);
    private studentService = inject(StudentService);
    private breadcrumbService = inject(BreadcrumbService);

    studentId = signal('');
    loading = signal(false);
    errorMessage = signal('');
    courses = signal<APIStudentCourse[]>([]);

    constructor() {
        effect(() => {
            this.breadcrumbService.setBreadcrumbs([
                { label: 'Admin', url: '/admin' },
                { label: 'Students', url: '/admin/students' },
                { label: 'Reserved Courses', url: `/admin/students/${this.studentId()}/courses` }
            ]);
        });

        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.errorMessage.set('Student id is missing.');
            return;
        }

        this.studentId.set(id);
        this.loadReservedCourses(id);
    }

    loadReservedCourses(id: string): void {
        this.loading.set(true);
        this.errorMessage.set('');

        this.studentService.getStudentReservedCourses(id).subscribe({
            next: (courses) => {
                this.courses.set(courses);
                this.loading.set(false);
            },
            error: (error: unknown) => {
                const message = error instanceof Error ? error.message : 'Failed to load reserved courses';
                this.errorMessage.set(message);
                this.courses.set([]);
                this.loading.set(false);
            }
        });
    }
}
