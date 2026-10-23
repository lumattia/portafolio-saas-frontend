import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../../../core/services/media.service';
import { Media, MediaType } from '../../../../core/models/media.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { ModalService } from '../../../../core/services/modal.service';
import { PagedList, PagedParameters, IdName } from '../../../../core/models/common.models';
import { MediaDetailModalComponent } from './media-detail-modal.component';
import { ImageProcessorComponent } from '../../../../shared/components/inputs/image-processor/image-processor.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { SelectInputComponent } from '../../../../shared/components/inputs/select-input/select-input.component';

@Component({
  selector: 'app-media-gallery',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, PaginationComponent, SelectInputComponent],
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.scss']
})
export class MediaGalleryComponent implements OnInit {
  private readonly mediaService = inject(MediaService);
  private readonly modalService = inject(ModalService);
  readonly MediaType = MediaType;
  readonly media = signal<Media[]>([]);
  readonly pagedParameters = signal<PagedParameters>(PagedParameters.default(12));
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal('');
  readonly sortOptions = signal<IdName[]>([
    { id: 'updatedAt', name: 'Updated' },
    { id: 'createdAt', name: 'Created' },
    { id: 'fileName', name: 'Name' },
    { id: 'size', name: 'Size' }
  ]);

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loading.set(true);
    this.error.set(null);

    this.mediaService.getMedia(
      this.searchQuery() || undefined,
      undefined,
      this.pagedParameters()
    ).subscribe({
      next: (response: PagedList<Media>) => {
        this.media.set(response.list);
        this.pagedParameters().fromPagedList(response)
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load media');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    this.pagedParameters().pageIndex = 1;
    this.loadMedia();
  }

  onSortChanged(): void {
    this.pagedParameters().isDescending = !this.pagedParameters().isDescending;
    this.loadMedia();
  }

  openMediaDetail(item: Media): void {
    const modalRef = this.modalService.open(MediaDetailModalComponent);
    modalRef.componentInstance.media = item;

    modalRef.result.then((result) => {
      if (result?.deleted) {
        this.loadMedia();
      } else if (result) {
        // Media was updated
        this.loadMedia();
      }
    });
  }

  onUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.openImageProcessor(file);
      }
    };
    input.click();
  }

  openImageProcessor(file: File): void {
    const modalRef = this.modalService.open(ImageProcessorComponent);
    modalRef.componentInstance.imageFile = file;

    modalRef.result.then((result: any) => {
      if (result?.data) {
        const processedFile = result.data as File;
        this.uploadFile(processedFile);
      }
    });
  }

  uploadFile(file: File): void {
    this.loading.set(true);
    this.mediaService.createMedia(file).subscribe({
      next: () => {
        this.loading.set(false);
        this.loadMedia();
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

}
