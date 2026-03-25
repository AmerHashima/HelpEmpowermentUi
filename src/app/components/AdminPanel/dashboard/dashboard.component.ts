// src\app\components\AdminPanel\dashboard\dashboard.component.ts
import { Component, inject, signal } from '@angular/core';
import { StudentService } from '../../../Services/student-service.service';
import { request } from 'http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private studentService = inject(StudentService);

  stats = signal({
    totalUsers: 1200,
    activeUsers: 850,
    currentUsers: 120,

    pmpExamSimulators: 15,
    pmpRecordedCourses: 8,
    pmpLiveCourses: 3,

    capmExamSimulators: 15,
    capmRecordedCourses: 8,
    capmLiveCourses: 3
  });

  ngOnInit(): void {

    const body = {
      filters: [],
      sort: [],
      pagination: {
        getAll: true,
        pageNumber: 0,
        pageSize: 0
      },
      columns: []
    };

    forkJoin({
      studentsRes: this.studentService.searchStudents(body),
      coursesRes: this.studentService.searchStudentCourses(body)
    }).subscribe({
      next: ({ studentsRes, coursesRes }) => {

        // 🔷 USERS
        const students = studentsRes.students ?? [];
        const totalUsers = studentsRes.total ?? students.length;
        const activeUsers = students.filter(s => s.isActive).length;
        const currentUsers = 0;

        // 🔷 COURSES
        const courses = coursesRes.courses ?? [];

        let pmpExam = 0, pmpRecorded = 0, pmpLive = 0;
        let capmExam = 0, capmRecorded = 0, capmLive = 0;

        courses.forEach(c => {
          const name = c.courseName?.toLowerCase();

          if (name === 'pmp') {
            if (c.examSimulationReserv) pmpExam++;
            if (c.recordedCourseReserv) pmpRecorded++;
            if (c.liveCourseReserv) pmpLive++;
          }

          if (name === 'capm') {
            if (c.examSimulationReserv) capmExam++;
            if (c.recordedCourseReserv) capmRecorded++;
            if (c.liveCourseReserv) capmLive++;
          }
        });

        this.stats.set({
          totalUsers,
          activeUsers,
          currentUsers,

          pmpExamSimulators: pmpExam,
          pmpRecordedCourses: pmpRecorded,
          pmpLiveCourses: pmpLive,

          capmExamSimulators: capmExam,
          capmRecordedCourses: capmRecorded,
          capmLiveCourses: capmLive
        });

      }
    });
  }
}
