import { Component, inject, signal } from '@angular/core';
import { confirmDelete } from '../../../../shared/utils/confirm-delete';
import { WebinarFormComponent } from '../webinar-form/webinar-form.component';
import { ReusableMaterialTableComponent } from '../../../../shared/angular-material-reusable-table/angular-material-reusable-table.component';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { WebinarService } from '../../../../Services/webinar.service';

@Component({
  selector: 'app-webinars',
  imports: [ReusableMaterialTableComponent, WebinarFormComponent],
  templateUrl: './webinars.component.html',
  styleUrl: './webinars.component.scss'
})
export class WebinarsComponent {
  // 🔹 inject
  private breadcrumb = inject(BreadcrumbService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private webinarService = inject(WebinarService);

  webinars = this.webinarService.webinars
  total = this.webinarService.total;
  pageSize = this.webinarService.pageSize;
  pageNumber = this.webinarService.pageNumber;
  filters = this.webinarService.filters;
  loading = signal<boolean>(false);

  hidden = signal<boolean>(false);
  oid: string = '';

  // 🔹 columns
  columns = [
    { field: 'webinarName', header: 'Name', type: 'text' },
    { field: 'courseName', header: 'Course', type: 'text' },
    { field: 'webinarDate', header: 'Date', type: 'text' },
    { field: 'webinarStartTime', header: 'Start Time', type: 'text' },
    { field: 'webinarEndTime', header: 'End Time', type: 'text' },
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

  ngOnInit() {
    this.breadcrumb.resetToRoute();

    this.route.queryParams.subscribe((params: any) => {

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

  onPageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onFilterChange(value: string) {
    const filters = [
      {
        propertyName: "webinarName",
        value: value,
        operation: 0
      }
    ]
    this.webinarService.filters.set([...filters]);
  }



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

  async handleDelete(row: any) {
    if (!(await confirmDelete('Are you sure you want to delete this webinar?'))) return;
    this.webinarService.deleteWebinar(row.oid).subscribe({
      next: () => this.webinarService.reloadWebiinars(this.pageNumber())

    })
  }

  onCancal() {
    this.router.navigate(['/admin/webinar']);
  }
}
