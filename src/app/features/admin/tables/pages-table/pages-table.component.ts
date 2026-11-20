import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageService } from '../../../../core/services/page.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { ModalService } from '../../../../core/services/modal.service';
import { PageFilters, PageTableItem } from '../../../../core/models/page.model';
import { PagedList, PagedParameters, IdName } from '../../../../core/models/common.models';
import { PagedTableComponent } from '../../../../shared/components/paged-table/paged-table.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { CheckboxInputComponent } from '../../../../shared/components/inputs/checkbox-input/checkbox-input.component';
import { ConfirmModalComponent } from '../../../../shared/components/modals/confirm-modal/confirm-modal.component';

type PageFlag = 'toPublish' | 'isPublished' | 'isDeleted' | 'disabled';

@Component({
  selector: 'app-pages-table',
  standalone: true,
  imports: [CommonModule, PagedTableComponent, ButtonComponent, TextInputComponent, CheckboxInputComponent],
  templateUrl: './pages-table.component.html'
})
export class PagesTableComponent implements OnInit {
  private readonly pageService = inject(PageService);
  private readonly viewModeService = inject(ViewModeService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);

  readonly items = signal<PageTableItem[]>([]);
  readonly pagedParameters = signal<PagedParameters>(PagedParameters.default(12));
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly sortOptions = signal<IdName[]>([
    { id: 'title', name: 'Title' },
    { id: 'slug', name: 'Slug' }
  ]);
  readonly filters: PageFilters = {};

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.pageService.getPages(this.pagedParameters(), this.filters).subscribe({
      next: (response: PagedList<PageTableItem>) => {
        this.items.set(response.list);
        this.pagedParameters().fromPagedList(response);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load items');
        this.loading.set(false);
      }
    });
  }

  openPage(page: PageTableItem): void {
    this.viewModeService.setViewMode('draft');
    this.router.navigateByUrl(page.slug);
  }

  onDelete(page: PageTableItem): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Delete Page';
    modalRef.componentInstance.message = `Are you sure you want to delete "${page.title}"?`;
    modalRef.result.then((result) => {
      if (result) {
        this.pageService.delete(page.id).subscribe({
          next: () => this.load(),
          error: () => this.error.set('Failed to delete page')
        });
      }
    });
  }
}
