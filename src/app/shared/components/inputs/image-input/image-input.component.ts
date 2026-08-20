import { Component, EventEmitter, Input, OnInit, Output, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageProcessorComponent } from '../image-processor/image-processor.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MessageModalComponent } from '../../modals/message-modal/message-modal.component';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss']
})
export class ImageInputComponent implements OnInit {
  private modalService = inject(ModalService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input() existingImageUrl: string | undefined = undefined;
  @Input() originalFileName: string | undefined = undefined;

  @Input() maxWidth?: number;
  @Input() maxHeight?: number;
  @Input() minAspectRatio?: number;
  @Input() maxAspectRatio?: number;
  @Input() fixedAspectRatio?: number;

  @Input() readonly: boolean = false;
  @Output() fileChanged = new EventEmitter<File>();

  previewUrl = signal<string | undefined>(undefined);
  currentFileName = signal<string>('');
  rawImageFile = signal<File | null>(null);
  format = signal<'png' | 'jpeg' | 'bmp' | 'webp' | 'ico'>('webp');

  ngOnInit() {
    this.currentFileName.set(this.originalFileName ?? '');
    if (this.existingImageUrl) {
      this.previewUrl.set(this.existingImageUrl);
      if (!this.originalFileName) {
        const name = this.existingImageUrl.substring(this.existingImageUrl.lastIndexOf('/') + 1);
        this.currentFileName.set(name.split('?')[0]);
      }
    }
  }

  ngOnChanges() {
    this.currentFileName.set(this.originalFileName ?? '');
    this.previewUrl.set(this.existingImageUrl);
  }

  async triggerManager(event: Event) {
    event.stopPropagation();
    if (this.readonly) return;
    if (this.previewUrl()) {
      if (!this.rawImageFile() && this.existingImageUrl) {
        const downloaded = await this.downloadRemoteImage();
        if (!downloaded) return;
      }
      this.openProcessorModal();
    }
    else {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.extractFormatFromMime(file.type)

      this.currentFileName.set(file.name);
      this.rawImageFile.set(file);
      this.openProcessorModal();
    }
    event.target.value = '';
  }

  private async downloadRemoteImage(): Promise<boolean> {
    try {
      const response = await fetch(this.existingImageUrl!);
      const blob = await response.blob();
      this.extractFormatFromMime(blob.type);
      const file = new File([blob], this.currentFileName() || 'image', { type: blob.type });
      this.rawImageFile.set(file);
      return true;
    } catch (error) {
      const modalRef = this.modalService.open(MessageModalComponent);
      modalRef.componentInstance.title= 'shared.imageInput.downloadErrorTitle';
      modalRef.componentInstance.message= 'shared.imageInput.downloadErrorMessage';
      modalRef.result.then((result) => {
        if (result) {
          this.fileInput.nativeElement.click();
        }
      });
      return false;
    }
  }

  private openProcessorModal() {
    const modalRef = this.modalService.open(ImageProcessorComponent);
    modalRef.componentInstance.imageFile= this.rawImageFile();
    modalRef.componentInstance.originalFormat= this.format();
    modalRef.componentInstance.maxWidth= this.maxWidth;
    modalRef.componentInstance.maxHeight= this.maxHeight;
    modalRef.componentInstance.minAspectRatio= this.minAspectRatio;
    modalRef.componentInstance.maxAspectRatio= this.maxAspectRatio;
    modalRef.componentInstance.fixedAspectRatio= this.fixedAspectRatio;

    modalRef.result.then((result: any) => {
      if (result.data === undefined) return;

      if (result.data === null) {
        // Eliminó la imagen
        this.previewUrl.set(undefined);
        this.rawImageFile.set(null);
        this.format.set('webp');
        this.currentFileName.set('');
        this.fileChanged.emit(new File([], 'delete'));
      } else {
        // Modificó/recortó la imagen - result is now a File
        const file = result.data as File;
        this.previewUrl.set(URL.createObjectURL(file));
        this.currentFileName.set(file.name);
        this.fileChanged.emit(file);
      }
    });
  }
  private extractFormatFromMime(mimeType: string) {
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      this.format.set('jpeg');
    } else if (mimeType.includes('webp')) {
      this.format.set('webp');
    } else if (mimeType.includes('bmp')) {
      this.format.set('bmp');
    } else if (mimeType.includes('icon')) {
      this.format.set('ico');
    } else {
      this.format.set('png');
    }
  }
}
