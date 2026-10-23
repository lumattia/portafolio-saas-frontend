import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Media } from '../../../../core/models/media.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ModalService } from '../../../../core/services/modal.service';
import { ImageProcessorComponent } from '../../../../shared/components/inputs/image-processor/image-processor.component';
import { ConfirmModalComponent } from '../../../../shared/components/modals/confirm-modal/confirm-modal.component';
import { MediaService } from '../../../../core/services/media.service';

@Component({
  selector: 'app-media-detail-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './media-detail-modal.component.html',
  styleUrls: ['./media-detail-modal.component.scss']
})
export class MediaDetailModalComponent {
  private modalService = inject(ModalService);
  private mediaService = inject(MediaService);

  close!: (result?: any) => void;
  dismiss!: (reason?: any) => void;

  @Input() media!: Media;

  readonly isDeleting = signal(false);

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onUpdate(): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Update Media';
    modalRef.componentInstance.message = 'Are you sure you want to update this media? This action will affect all media currently in use.';
    modalRef.result.then((result) => {
      if (result?.data) {
        this.downloadAndProcess();
      }
    });
  }

  private async downloadAndProcess(): Promise<void> {
    try {
      const response = await fetch(this.media.url);
      const blob = await response.blob();
      const file = new File([blob], this.media.fileName, { type: blob.type });
      const modalRef = this.modalService.open(ImageProcessorComponent, {disableBackdropClick : true});
      modalRef.componentInstance.imageFile = file;

      modalRef.result.then((result: any) => {
        if (result?.data) {
          const processedFile = result.data as File;
          this.mediaService.updateMedia(this.media.id, processedFile).subscribe({
            next: (updatedMedia) => {
              this.close(updatedMedia);
            },
            error: () => {
              console.error('Failed to update media');
            }
          });
        }
      });
    } catch (error) {
      console.error('Error downloading image for processing:', error);
    }
  }

  onDelete(): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Delete Media';
    modalRef.componentInstance.message = 'Are you sure you want to delete this media?';

    modalRef.result.then((result) => {
      if (result?.data) {
        this.isDeleting.set(true);
        this.mediaService.deleteMedia(this.media.id).subscribe({
          next: () => {
            this.isDeleting.set(false);
            this.close({ deleted: true });
          },
          error: () => {
            this.isDeleting.set(false);
          }
        });
      }
    });
  }
}
