import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TextInputComponent } from '../../../shared/components/inputs/text-input/text-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PageService } from '../../../core/services/page.service';
import { PageRequest } from '../../../core/models/page.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalService } from '../../../core/services/modal.service';
import { MessageModalComponent } from '../../../shared/components/modals/message-modal/message-modal.component';

@Component({
  selector: 'app-page-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ButtonComponent],
  templateUrl: './page-settings.component.html',
  styleUrls: ['./page-settings.component.scss']
})
export class PageSettingsComponent implements OnInit {
  close!: () => void;
  dismiss!: (reason?: any) => void;
  title = input<string>('');
  slug = input<string>('');
  metaDescription = input<string>('');
  pageId = input<string>('');

  private readonly pageService = inject(PageService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly modalService = inject(ModalService);

  titleControl = new FormControl('');
  slugControl = new FormControl('');
  metaDescriptionControl = new FormControl('');

  ngOnInit(): void {
    this.titleControl.setValue(this.title());
    this.slugControl.setValue(this.slug());
    this.metaDescriptionControl.setValue(this.metaDescription());
  }

  save(): void {
    const request: PageRequest = {
      title: this.titleControl.value || '',
      slug: this.slugControl.value || '',
      metaDescription: this.metaDescriptionControl.value || '',
      sections: undefined
    };

    if (!this.pageId()) {
      this.pageService.create(request).subscribe({
        next: (page) => {
          this.router.navigate([`/${page.slug}`]);
          this.close();
        },
        error: (err) => {
          console.error('Failed to create page', err);
          const modalRef = this.modalService.open(MessageModalComponent);
          modalRef.componentInstance.title = 'Error al Crear';
          modalRef.componentInstance.message = err.error?.message || 'Ocurrió un error al crear la página. El slug podría ya estar en uso.';
          modalRef.componentInstance.type = 'error';
        }
      });
    } else {
      this.pageService.update(this.pageId(), request).subscribe({
        next: (detail) => {
          this.location.replaceState(`${detail.slug}`);
          this.close();
        },
        error: (err) => {
          console.error('Failed to update page', err);
          const modalRef = this.modalService.open(MessageModalComponent);
          modalRef.componentInstance.title = 'Error al Actualizar';
          modalRef.componentInstance.message = err.error?.message || 'Ocurrió un error al actualizar la página. El slug podría ya estar en uso.';
          modalRef.componentInstance.type = 'error';
        }
      });
    }
  }

  cancel(): void {
    this.dismiss();
  }
}
