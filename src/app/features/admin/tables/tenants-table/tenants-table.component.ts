import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantService } from '../../../../core/services/tenant.service';
import { Tenant, TenantFilters } from '../../../../core/models/tenant.model';
import { PagedList, PagedParameters, IdName } from '../../../../core/models/common.models';
import { PagedTableComponent } from '../../../../shared/components/paged-table/paged-table.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { ModalService } from '../../../../core/services/modal.service';
import { CreateTenantModalComponent } from './create-tenant-modal/create-tenant-modal.component';

@Component({
  selector: 'app-tenants-table',
  standalone: true,
  imports: [CommonModule, PagedTableComponent, ButtonComponent, TextInputComponent],
  templateUrl: './tenants-table.component.html',
  styleUrls: ['./tenants-table.component.scss']
})
export class TenantsTableComponent implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly modalService = inject(ModalService);

  readonly items = signal<Tenant[]>([]);
  readonly pagedParameters = signal<PagedParameters>(PagedParameters.default(12));
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly sortOptions = signal<IdName[]>([
    { id: 'domain', name: 'Domain' }
  ]);
  readonly filters: TenantFilters = {};

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.tenantService.getTenants(this.pagedParameters(), this.filters).subscribe({
      next: (response: PagedList<Tenant>) => {
        this.items.set(response.list);
        this.pagedParameters().fromPagedList(response);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tenants');
        this.loading.set(false);
      }
    });
  }

  openCreateTenant(): void {
    const modalRef = this.modalService.open(CreateTenantModalComponent);
    modalRef.result.then((result) => {
      if (result?.confirmed) this.load();
    });
  }
}
