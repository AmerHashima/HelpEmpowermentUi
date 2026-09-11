import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { DashboardService } from '../../../Services/dashboard.service';
import { AssignedDashboard } from '../../../models/assigned-dashboard';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent {
  private dashboardService = inject(DashboardService);
  private auth = inject(AuthService);

  stats = signal<AssignedDashboard | null>(null);
  loading = signal(true);
  errorMessage = signal('');
  isAdmin = computed(() =>
    this.auth.loggedAdmin()?.roles.some(role => role.toLowerCase() === 'admin') ?? false
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.dashboardService.getMine().subscribe({
      next: stats => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load dashboard data.');
        this.loading.set(false);
      }
    });
  }
}
