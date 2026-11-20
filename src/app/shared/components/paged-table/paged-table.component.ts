import { Component, ViewEncapsulation, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { ButtonComponent } from '../button/button.component';
import { IdName, PagedParameters } from '../../../core/models/common.models';
import { SortComponent } from '../sort/sort.component';

@Component({
  selector: 'app-paged-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, ButtonComponent, SortComponent],
  templateUrl: './paged-table.component.html',
  styleUrls: ['./paged-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagedTableComponent {
  title = input.required<string>();
  page = input.required<PagedParameters>();
  sortOptions = input<IdName[]>([]);
  loading = input.required<boolean>();
  error = input<string | null>(null);
  itemCount = input.required<number>();
  emptyMessage = input('No items found');

  readonly pageChanged = output<void>();
  readonly filtersOpen = signal(false);

  toggleFilters(): void {
    this.filtersOpen.update(open => !open);
  }
}
