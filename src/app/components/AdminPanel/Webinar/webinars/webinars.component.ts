import { Component, inject, signal } from '@angular/core';
import { WebinarFormComponent } from '../webinar-form/webinar-form.component';
import { ReusableMaterialTableComponent } from '../../../../shared/angular-material-reusable-table/angular-material-reusable-table.component';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { WebinarService } from '../../../../Services/webinar.service';

@Component({
  selector: 'app-webinars',
  imports: [ReusableMaterialTableComponent,WebinarFormComponent],
  templateUrl: './webinars.component.html',
  styleUrl: './webinars.component.scss'
})
export class WebinarsComponent {
  // 🔹 inject
  private breadcrumb = inject(BreadcrumbService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private webinarService = inject(WebinarService);
  // 🔹 state
  // branches = computed(() => this.store.items());
  // total = computed(() => this.store.total());
  // pageSize = computed(() => this.store.pageSize());
  // loading = computed(() => this.store.loading());
  webinars =this.webinarService.webinars
  total = signal<number>(0);
  pageSize = signal<number>(10);
  loading = signal<boolean>(false);

  hidden = signal<boolean>(false);
  oid: string = '';

  // 🔹 columns
  columns = [
    { field: 'webinarName', header: 'Name', type: 'text' },
    { field: 'webinarFormat', header: 'Type', type: 'text' },
    { field: 'webinarDate', header: 'Date', type: 'text' },
    { field: 'webinarStartTime', header: 'Start Time', type: 'text' },
    { field: 'webinarEndTime', header: 'End Tile', type: 'text' },
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

    this.route.queryParams.subscribe((params:any) => {
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
