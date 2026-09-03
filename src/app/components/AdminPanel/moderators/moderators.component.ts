import { Component, inject, signal } from '@angular/core';
import { BreadcrumbService } from '../../../Services/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModeratorService } from '../../../Services/moderator-services.service';
import { PageEvent } from '@angular/material/paginator';
import { ModeratorFormComponent } from './moderator-form/moderator-form.component';
import { ReusableMaterialTableComponent } from '../../../shared/angular-material-reusable-table/angular-material-reusable-table.component';
import { confirmDelete } from '../../../shared/utils/confirm-delete';

@Component({
  selector: 'app-moderators',
  imports: [ModeratorFormComponent, ReusableMaterialTableComponent],
  templateUrl: './moderators.component.html',
  styleUrl: './moderators.component.scss'
})
export class ModeratorsComponent {
  private breadcrumb = inject(BreadcrumbService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private moderatorService = inject(ModeratorService);
  moderators = this.moderatorService.moderators
  total = this.moderatorService.total;
  pageSize = this.moderatorService.pageSize;
  pageNumber = this.moderatorService.pageNumber;
  filters = this.moderatorService.filters;
  loading = signal<boolean>(false);

  hidden = signal<boolean>(false);
  oid: string = '';

  // 🔹 columns
  columns = [
    { field: 'username', header: 'Username', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
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
        propertyName: "nameEn",
        value: value,
        operation: 0
      }
    ]
    this.moderatorService.filters.set([...filters]);
  }



  handleAddNew() {
    this.router.navigate(['/admin/moderators'], {
      queryParams: { mode: 'create' }
    });
  }

  handleEdit(row: any) {
    this.router.navigate(['/admin/moderators'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  handleSingleModeratorNavigation(row: any) {
    this.router.navigate(['/admin/moderators'], {
      queryParams: { mode: 'edit', id: row.oid }
    });
  }

  async handleDelete(row: any) {
    if (!(await confirmDelete('Are you sure you want to delete this moderator?'))) return;

    this.moderatorService.deleteModerator(row.oid).subscribe({
      next: () => this.moderatorService.reloadModerators(this.pageNumber())
    });
  }

  onCancal() {
    this.router.navigate(['/admin/moderators']);
  }
}
