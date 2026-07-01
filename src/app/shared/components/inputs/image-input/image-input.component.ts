import { Component, input, output, signal, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ImageInputConfig {
  maxWidth?: number;
  maxHeight?: number;
  maxScale?: number;
  quality?: number;
  aspectRatio?: number;
}

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss'],
})
export class ImageInputComponent {
  config = input<Partial<ImageInputConfig>>({});
  value = input<string>('');
  valueChange = output<string>();

  readonly previewUrl = signal<string>('');
  readonly isDragging = signal(false);
  readonly isProcessing = signal(false);
  readonly showCropper = signal(false);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    // Initialize preview with existing value when it changes
    effect(() => {
      const currentValue = this.value();
      if (currentValue) {
        this.previewUrl.set(currentValue);
      } else {
        this.previewUrl.set('');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  onRemoveImage(): void {
    this.previewUrl.set('');
    this.valueChange.emit('');
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  private async processFile(file: File): Promise<void> {
    this.isProcessing.set(true);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('File must be an image');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        console.error('File size must be less than 10MB');
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      this.previewUrl.set(previewUrl);

      // Process image (resize and compress)
      const processedDataUrl = await this.processImage(file);
      this.valueChange.emit(processedDataUrl);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      this.isProcessing.set(false);
    }
  }

  private async processImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        const config = this.config();
        const maxWidth = config.maxWidth || 1920;
        const maxHeight = config.maxHeight || 1080;
        const quality = config.quality || 0.8;
        const aspectRatio = config.aspectRatio;

        // Calculate dimensions
        let width = img.width;
        let height = img.height;

        // Apply aspect ratio if specified
        if (aspectRatio) {
          const targetRatio = aspectRatio;
          const currentRatio = width / height;

          if (currentRatio > targetRatio) {
            // Image is wider than target, crop width
            const newWidth = height * targetRatio;
            const xOffset = (width - newWidth) / 2;
            width = newWidth;
            // We'll handle cropping in the canvas draw
          } else {
            // Image is taller than target, crop height
            const newHeight = width / targetRatio;
            const yOffset = (height - newHeight) / 2;
            height = newHeight;
          }
        }

        // Resize if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      reader.onerror = () => reject(new Error('Failed to read file'));

      reader.readAsDataURL(file);
    });
  }
}
