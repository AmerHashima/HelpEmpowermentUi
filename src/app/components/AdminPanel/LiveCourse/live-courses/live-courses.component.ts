import { Component, inject, signal } from '@angular/core';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveCourseService } from '../../../../Services/live-course.service';
import { PageEvent } from '@angular/material/paginator';
import { ReusableMaterialTableComponent } from '../../../../shared/angular-material-reusable-table/angular-material-reusable-table.component';
import { LiveCourseFormComponent } from '../live-course-form/live-course-form.component';

@Component({
  selector: 'app-live-courses',
  imports: [ReusableMaterialTableComponent, LiveCourseFormComponent],
  templateUrl: './live-courses.component.html',
  styleUrl: './live-courses.component.scss'
})
export class LiveCoursesComponent {
  // 🔹 inject
  private breadcrumb = inject(BreadcrumbService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private liveCourseService = inject(LiveCourseService);
  // 🔹 state
  // branches = computed(() => this.store.items());
  // total = computed(() => this.store.total());
  // pageSize = computed(() => this.store.pageSize());
  // loading = computed(() => this.store.loading());
  liveCourses = this.liveCourseService.liveCourses
  total = this.liveCourseService.total;
  pageSize = this.liveCourseService.pageSize;
  pageNumber = this.liveCourseService.pageNumber;
  filters = this.liveCourseService.filters
  loading = signal<boolean>(false);

  hidden = signal<boolean>(false);
  oid: string = '';

  // 🔹 columns
  columns = [
    { field: 'courseName', header: 'Name', type: 'text' },
    { field: 'courseRefName', header: 'Course', type: 'text' },
    { field: 'startDate', header: 'Start Date', type: 'text' },
    { field: 'startTime', header: 'Start Time', type: 'text' },
    { field: 'numberOfSessions', header: 'Sessions No.', type: 'text' },
    { field: 'totalHours', header: 'Total Hours', type: 'text' },
    {
      field: 'isActive',
      header: 'Status',
      type: 'badge',
      badge: {
        trueLabel: 'Active',
        falseLabel: 'Inactive',
        trueClass: 'bg-success',
        falseClass: 'bg-danger'
      }
    },
    { field: 'actions', header: 'Actions', type: 'buttons' }
  ];

  constructor() { }

  // 🔥 ROUTE → STATE
  ngOnInit() {
    this.breadcrumb.resetToRoute();

    this.route.queryParams.subscribe((params: any) => {
      console.log('QUERY PARAMS:', params);

      const mode = params['mode'];
      const id = params['id'];

      if (!mode) {
        // table
        this.hidden.set(false);
        this.oid = '';
        return;
      }

      if (mode === 'create') {
        this.hidden.set(true);
        this.oid = '';
        return;
      }

      if (mode === 'edit') {
        this.hidden.set(true);
        this.oid = id || '';
        return;
      }
    });
  }

  // 🔹 table events
  onPageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onFilterChange(value: string) {
    const filters = [
      {
        propertyName: "courseName",
        value: value,
        operation: 0
      }
    ]
    this.liveCourseService.filters.set([...filters]);
  }



  // 🔥 NAVIGATION (ONLY change URL)

  handleAddNew() {
    this.router.navigate(['/admin/live-course'], {
      queryParams: { mode: 'create' }
    });
  }

  handleEdit(row: any) {
    this.router.navigate(['/admin/live-course'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleSingleCourserNavigation(row: any) {
    this.router.navigate(['/admin/live-course'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleDelete(row: any) {
    this.liveCourseService.deleteLiveCourse(row.oid).subscribe({
      next: () => this.pageNumber.update(p => p)
    })
  }

  onCancal() {
    this.router.navigate(['/admin/live-course']);
  }
}
