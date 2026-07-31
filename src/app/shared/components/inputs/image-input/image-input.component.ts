import { Component, EventEmitter, Input, OnInit, Output, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageProcessorComponent } from '../image-processor/image-processor.component';
import { TranslatePipe } from '@ngx-translate/core';
import { GenericErrorModalComponent } from '../../modals/generic-error-modal/generic-error-modal.component';
import { FileInfoRequest } from '../../../../core/models/common.models';
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
  @Output() fileChanged = new EventEmitter<FileInfoRequest>();

  previewUrl = signal<string | undefined>(undefined);
  currentFileName = signal<string>('');
  rawImageSource = signal<string>('');
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
      if (!this.rawImageSource() && this.existingImageUrl) {
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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.rawImageSource.set(e.target.result);
        this.openProcessorModal();
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  private async downloadRemoteImage(): Promise<boolean> {
    try {
      const response = await fetch(this.existingImageUrl!);
      const blob = await response.blob();
      this.extractFormatFromMime(blob.type);
      return new Promise<boolean>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.rawImageSource.set(e.target.result);
          resolve(true);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      const modalRef = this.modalService.open(GenericErrorModalComponent, {
        title: 'shared.imageInput.downloadErrorTitle',
        message: 'shared.imageInput.downloadErrorMessage'
      });
      modalRef.result.then((result) => {
        if (result) {
          this.fileInput.nativeElement.click();
        }
      });
      return false;
    }
  }

  private openProcessorModal() {
    const modalRef = this.modalService.open(ImageProcessorComponent, {
      imageBase64: this.rawImageSource(),
      originalFormat: this.format(),
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight,
      minAspectRatio: this.minAspectRatio,
      maxAspectRatio: this.maxAspectRatio,
      fixedAspectRatio: this.fixedAspectRatio
    });

    modalRef.result.then((result: any) => {
      if (result.data === undefined) return;

      if (result.data === null) {
        // Eliminó la imagen
        this.previewUrl.set(undefined);
        this.rawImageSource.set('');
        this.format.set('webp');
        this.currentFileName.set('');
        const emptyFile: FileInfoRequest = {
          base64: '',
          fileName: 'delete.txt',
          contentType: 'text/plain'
        };
        this.fileChanged.emit(emptyFile);
      } else {
        // Modificó/recortó la imagen
        this.previewUrl.set(result.data);
        const finalFile = this.base64ToFile(result.data);
        this.fileChanged.emit(finalFile);
      }
    });
  }
  private base64ToFile(base64Data: string): FileInfoRequest {
    const arr = base64Data.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    return {
      base64: base64Data,
      fileName: this.currentFileName(),
      contentType: contentType
    };
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
