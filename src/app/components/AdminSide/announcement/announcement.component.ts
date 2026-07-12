import { Component, inject, signal } from '@angular/core';
import { confirmDelete } from '../../../shared/utils/confirm-delete';
import { ReusableMaterialTableComponent } from '../../../shared/angular-material-reusable-table/angular-material-reusable-table.component';
import { AnnouncementFormComponent } from './announcement-form/announcement-form.component';
import { BreadcrumbService } from '../../../Services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from '../../../Services/lookup.service';
import { PageEvent } from '@angular/material/paginator';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-announcement',
  imports: [ReusableMaterialTableComponent,AnnouncementFormComponent,AsyncPipe],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent {
  private breadcrumb = inject(BreadcrumbService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lookupService = inject(LookupService);

  announcement$ = this.lookupService.getAnnouncements();
  // total = this.webinarService.total;
  // pageSize = this.webinarService.pageSize;
  // pageNumber = this.webinarService.pageNumber;
  // filters = this.webinarService.filters;
  // loading = signal<boolean>(false);

  hidden = signal<boolean>(false);
  oid: string = '';

  // 🔹 columns
  columns = [
    { field: 'lookupValue', header: 'Title', type: 'text' },
    { field: 'lookupNameEn', header: 'Message', type: 'text' },
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
    // this.pageNumber.set(event.pageIndex);
    // this.pageSize.set(event.pageSize);
  }

  onFilterChange(value: string) {
    // const filters = [
    //   {
    //     propertyName: "webinarName",
    //     value: value,
    //     operation: 0
    //   }
    // ]
    // this.webinarService.filters.set([...filters]);
  }



  handleAddNew() {
    this.router.navigate(['/admin/announcements'], {
      queryParams: { mode: 'create' }
    });
  }

  handleEdit(row: any) {
    this.router.navigate(['/admin/announcements'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleSingleNavigation(row: any) {
    this.router.navigate(['/admin/announcements'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  async handleDelete(row: any) {
    if (!(await confirmDelete('Are you sure you want to delete this announcement?'))) return;
    this.lookupService.deleteLookUpDetail(row.oid).subscribe({
      next: () => this.announcement$ = this.lookupService.getAnnouncements()
    })
  }

  onCancal() {
    this.announcement$ = this.lookupService.getAnnouncements()
    this.router.navigate(['/admin/announcements']);
  }
}
