import { Component, inject, signal } from '@angular/core';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveCourseService } from '../../../../Services/live-course.service';
import { PageEvent } from '@angular/material/paginator';
import { ReusableMaterialTableComponent } from '../../../../shared/angular-material-reusable-table/angular-material-reusable-table.component';
import { LiveCourseFormComponent } from '../live-course-form/live-course-form.component';

@Component({
  selector: 'app-live-courses',
  imports: [ReusableMaterialTableComponent,LiveCourseFormComponent],
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
  total = signal<number>(0);
  pageSize = signal<number>(10);
  loading = signal<boolean>(false);

  hidden = signal<boolean>(false);
  oid: string = '';

  // 🔹 columns
  columns = [
    { field: 'courseName', header: 'Name', type: 'text' },
    { field: 'courseFormat', header: 'Type', type: 'text' },
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
    console.log('pagination', event);
  }

  onFilterChange(value: string) {
    // this.store.setSearch(value);
  }

  onSortChange(sort: any) {
    // this.store.setSort(sort);
  }

  // 🔥 NAVIGATION (ONLY change URL)

  handleAddNew() {
    this.router.navigate(['/admin/webinar'], {
      queryParams: { mode: 'create' }
    });
  }

  handleEdit(row: any) {
    this.router.navigate(['/admin/webinar'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleSingleWebinarNavigation(row: any) {
    this.router.navigate(['/admin/webinar'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleDelete(row: any) {
  }

  onCancal() {
    this.router.navigate(['/admin/webinar']);
  }
}
