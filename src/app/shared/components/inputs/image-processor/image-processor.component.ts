import { Component, Input, OnChanges, ChangeDetectorRef, inject, signal, computed, Signal, ViewChild, Renderer2, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperComponent, CropperPosition, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ButtonComponent } from '../../button/button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { NumberInputComponent } from "../number-input/number-input.component";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-processor',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent, ButtonComponent, TranslatePipe, NumberInputComponent],
  templateUrl: './image-processor.component.html',
  styleUrls: ['./image-processor.component.scss']
})
export class ImageProcessorComponent implements OnChanges {
  // Inyectados automáticamente por tu ModalService al abrir el modal
  close?: (result?: File|null) => void;
  dismiss?: (reason?: any) => void;

  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  // Inputs asignados dinámicamente por tu ModalService
  @Input() imageFile: File | undefined = undefined;
  @Input() originalFormat: 'png' | 'jpeg' | 'bmp' | 'webp' | 'ico' = 'webp';
  @Input({ transform: (v: number | null | undefined) => v ?? 1920 }) maxWidth = 0;
  @Input({ transform: (v: number | null | undefined) => v ?? 1080 }) maxHeight = 1080;
  @Input({ transform: (v: number | null | undefined) => v ?? 0.25 }) minAspectRatio = 0.25; // Alto 4, Ancho 1
  @Input({ transform: (v: number | null | undefined) => v ?? 4.0 }) maxAspectRatio = 4.0; // Alto 1, Ancho 4
  @Input() fixedAspectRatio?: number;
  @Input({ transform: (v: number | null | undefined) => v ?? 1024 }) maxFileSizeKB = 1024;

  private cdr = inject(ChangeDetectorRef);
  cropCoords = signal<CropperPosition | null>(null);

  // Crop field
  quality = signal<number>(80);
  cropWidth = signal<number>(this.maxWidth);
  cropHeight = signal<number>(this.maxHeight);

  // Result image info
  resultBlob = signal<Blob | null>(null);
  resultImageSize = signal<{ width: number; height: number } | null>(null);
  resultFileSizeKB = signal<number>(0);
  isFileSizeValid = computed(() => this.resultFileSizeKB() <= this.maxFileSizeKB);

  // Create object URL for preview from blob
  safeUrl = computed(() => {
    const blob = this.resultBlob();
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return '';
  });

  format = computed(() => {
    if (this.quality() === 100) {
      return this.originalFormat;
    }
    return 'webp';
  });

  // Signals computados para validar en tiempo real
  currentCropRatio: Signal<number> = computed(() => {
    const coords = this.cropCoords();
    if (!coords) return 1;
    const w = coords.x2 - coords.x1;
    const h = coords.y2 - coords.y1;
    return h > 0 ? w / h : 1;
  });

  isRatioValid = computed(() => {
    if (this.fixedAspectRatio) return true; // Si es fixed, se asume blindado y válido
    const ratio = this.currentCropRatio();
    return ratio >= this.minAspectRatio && ratio <= this.maxAspectRatio;
  });

  isFormValid = computed(() => {
    // Si la imagen se eliminó, el form es válido (representa una confirmación de borrado)
    if (!this.imageFile) return true;
    return this.isRatioValid() && this.cropCoords() !== null && this.isFileSizeValid();
  });

  ratioInstructionMessage = computed(() => {
    const current = this.currentCropRatio();

    if (current > this.maxAspectRatio) {
      return 'shared.imageInput.tooWide';
    }
    if (current < this.minAspectRatio) {
      return 'shared.imageInput.tooHigh';
    }
    return '';
  });

  fileSizeMessage = computed(() => {
    const sizeKB = this.resultFileSizeKB();
    const sizeMB = sizeKB / 1024;
    if (sizeMB > this.maxFileSizeKB) {
      return `Result size: ${sizeMB.toFixed(2)}MB (max: ${(this.maxFileSizeKB / 1024).toFixed(2)}MB)`;
    }
    return `Result size: ${sizeMB.toFixed(2)}MB`;
  });
  constructor() {
    effect(() => {
      const width = this.cropWidth();
      const height = this.cropHeight();
      const q = this.quality();
      setTimeout(() => {
        if (this.imageCropper) {
          this.imageCropper.crop();
        }
      });
    });
  }
  ngOnInit() {
    this.cropWidth.set(this.maxWidth);
    this.cropHeight.set(this.maxHeight);
  }
  ngOnChanges() {
    // Reset crop dimensions to max values when inputs change
    this.cropWidth.set(this.maxWidth);
    this.cropHeight.set(this.maxHeight);
    // El truco de magia de tu ModalService para asegurar que la UI se entere de los cambios de inputs
    this.cdr.detectChanges();
  }

  removeImage() {
    this.cropCoords.set(null);
    this.resultImageSize.set(null);
    this.resultFileSizeKB.set(0);
    this.close?.(null);
  }

  onImageLoaded(event: LoadedImage) {
    // Get original image dimensions from the loaded image
    const imageElement = event.original.image;
    const width = imageElement.width;
    const height = imageElement.height;

    // Store original image size
    this.resultImageSize.set({ width, height });

    // Set crop dimensions to original image size if smaller than max
    this.cropWidth.set(Math.min(width, this.maxWidth));
    this.cropHeight.set(Math.min(height, this.maxHeight));
  }

  onCropChange(event: CropperPosition) {
    if (event) {
      const newCoords = {
        x1: Math.round(event.x1),
        y1: Math.round(event.y1),
        x2: Math.round(event.x2),
        y2: Math.round(event.y2)
      };

      this.cropCoords.set(newCoords);
    }
  }
  onCrop(event: ImageCroppedEvent){
    this.resultBlob.set(event.blob!);
    if (event.width && event.height) this.resultImageSize.set({ width: event.width, height: event.height });
    this.resultFileSizeKB.set(Math.round((event.blob?.size || 0) / 1024));
  }

  saveImage() {
    if (!this.isFormValid()) return;

    if (!this.imageFile) {
      this.close?.(null); // Retorna null indicando al input que borre el archivo
      return;
    }

    // Convert blob to File before returning
    const blob = this.resultBlob();
    if (blob) {
      const file = new File([blob], `image.${this.format()}`, { type: blob.type });
      this.close?.(file);
    }
  }
  onCancelClick(): void {
    this.close?.(undefined); // Retorna undefined para ignorar cualquier cambio
  }
}
