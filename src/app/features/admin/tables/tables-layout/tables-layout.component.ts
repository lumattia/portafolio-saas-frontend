import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-tables-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tables-layout.component.html',
  styleUrls: ['./tables-layout.component.scss']
})
export class TablesLayoutComponent {
  private readonly auth = inject(AuthService);

  readonly tables = computed(() => {
    const items = [
      { path: '/tables/pages', name: 'Pages', icon: 'table' },
      { path: '/tables/versions', name: 'Versions', icon: 'eye' }
    ];
    if (this.auth.isPlatformAdmin()) {
      items.push({ path: '/tables/tenants', name: 'Tenants', icon: 'building' });
    }
    return items;
  });
}
