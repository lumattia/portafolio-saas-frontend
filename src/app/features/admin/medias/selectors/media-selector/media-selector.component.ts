import { Component, inject, signal, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../../../../core/services/media.service';
import { Media, MediaType } from '../../../../../core/models/media.model';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { TextInputComponent } from '../../../../../shared/components/inputs/text-input/text-input.component';
import { PagedList, PagedParameters } from '../../../../../core/models/common.models';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ModalService } from '../../../../../core/services/modal.service';
import { ImageProcessorComponent } from '../../../../../shared/components/inputs/image-processor/image-processor.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-media-selector',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, TextInputComponent, PaginationComponent],
  templateUrl: './media-selector.component.html',
  styleUrls: ['./media-selector.component.scss'],
})
export class MediaSelectorComponent implements OnInit {
  private readonly mediaService = inject(MediaService);
  private readonly modalService = inject(ModalService);

  close!: (result?: Media) => void;
  dismiss!: (reason?: any) => void;

  @Input() mediaType: MediaType = MediaType.Image;

  readonly searchQuery = signal('');

  readonly mediaItems = signal<Media[]>([]);
  readonly pagedParameters = signal<PagedParameters>(PagedParameters.default(12));
  readonly isLoading = signal(false);
  readonly selectedMedia = signal<Media | null>(null);
  readonly isUploading = signal(false);

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.isLoading.set(true);
    this.mediaService.getMedia(
      this.searchQuery() || undefined,
      this.mediaType.toString(),
      this.pagedParameters()
    ).subscribe({
      next: (response: PagedList<Media>) => {
        this.mediaItems.set(response.list);
        this.pagedParameters().fromPagedList(response)
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.pagedParameters().pageIndex = 1;
    this.loadMedia();
  }


  selectMedia(item: Media): void {
    this.selectedMedia.set(item);
    this.close(item);
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
    this.isUploading.set(true);
    this.mediaService.createMedia(file).subscribe({
      next: (media) => {
        this.isUploading.set(false);
        this.loadMedia();
      },
      error: () => {
        this.isUploading.set(false);
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

  // TODO: Future features to add:
  // - FileSelector component for non-image files
  // - MediaSelector that shows available selector types (ImageSelector, FileSelector, etc.)
  // - Different view layouts for file types
  // - Drag and drop functionality
  // - Advanced filtering options
  // - Media usage tracker
  // - Bulk operations
}
