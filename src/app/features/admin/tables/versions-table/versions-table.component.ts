import { PageFilters } from './../../../../core/models/page.model';
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { VersionService } from '../../../../core/services/version.service';
import { PageService } from '../../../../core/services/page.service';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { ModalService } from '../../../../core/services/modal.service';
import { PageTableItem } from '../../../../core/models/page.model';
import { VersionList } from '../../../../core/models/version.model';
import { PagedList, PagedParameters, IdName } from '../../../../core/models/common.models';
import { PagedTableComponent } from '../../../../shared/components/paged-table/paged-table.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SelectInputComponent } from '../../../../shared/components/inputs/select-input/select-input.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { CheckboxInputComponent } from '../../../../shared/components/inputs/checkbox-input/checkbox-input.component';
import { ConfirmModalComponent } from '../../../../shared/components/modals/confirm-modal/confirm-modal.component';

type SnapshotFlag = 'isDeleted' | 'disabled';

@Component({
  selector: 'app-versions-table',
  standalone: true,
  imports: [CommonModule, PagedTableComponent, ButtonComponent, SelectInputComponent, TextInputComponent, CheckboxInputComponent],
  templateUrl: './versions-table.component.html'
})
export class VersionsTableComponent implements OnInit {
  private readonly versionService = inject(VersionService);
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
  readonly versions = signal<IdName[]>([]);
  readonly currentVersionId = signal<string | null>(null);
  readonly selectedVersion = signal<string | null>(null);
  readonly showLatest = signal(false);
  readonly filters: PageFilters = {};

  private readonly effectiveCurrentVersionId = computed(() =>
    this.currentVersionId() ?? this.versions()[0]?.id ?? null
  );
  readonly versionOptions = computed<IdName[]>(() =>
    this.versions().map(v => ({
      id: v.id,
      name: `${v.name}${String(v.id) === String(this.effectiveCurrentVersionId()) ? ' (current)' : ''}`
    }))
  );

  ngOnInit(): void {
    this.versionService.getVersions().subscribe({
      next: (result: VersionList) => {
        this.versions.set(result.versions);
        this.currentVersionId.set(result.currentVersionId);
        const defaultVersionId = result.currentVersionId ?? result.versions[0]?.id;
        this.selectedVersion.set(defaultVersionId != null ? String(defaultVersionId) : null);
        this.load();
      },
      error: () => this.error.set('Failed to load versions')
    });
  }

  onVersionChange(value: any): void {
    this.selectedVersion.set(value || null);
    this.reload();
  }

  toggleLatest(): void {
    this.showLatest.update(v => !v);
    this.reload();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.fetch(this.pagedParameters()).subscribe({
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

  reload(): void {
    this.pagedParameters().pageIndex = 1;
    this.load();
  }

  private fetch(parameters: PagedParameters): Observable<PagedList<PageTableItem>> {
    if (!this.showLatest() && !this.selectedVersion()) {
      return of({ list: [], pageIndex: parameters.pageIndex, pageSize: parameters.pageSize, totalPages: 0 });
    }
    return this.versionService.getPages(this.selectedVersion(), this.showLatest(), parameters, this.filters);
  }

  openPage(page: PageTableItem): void {
    this.viewModeService.setViewMode('snapshot');
    this.router.navigateByUrl(page.slug);
  }

  onDelete(page: PageTableItem): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Delete Page';
    modalRef.componentInstance.message = `Are you sure you want to delete "${page.title}"?`;
    modalRef.result.then((result) => {
      if (result) {
        this.pageService.delete(page.originalPageId ?? page.id).subscribe({
          next: () => this.reload(),
          error: () => this.error.set('Failed to delete page')
        });
      }
    });
  }

  formatDate(date?: string): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }
}
