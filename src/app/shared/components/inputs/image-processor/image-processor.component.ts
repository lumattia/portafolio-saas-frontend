import { Component, Input, OnChanges, ChangeDetectorRef, inject, signal, computed, Signal, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperComponent, CropperPosition, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ButtonComponent } from '../../button/button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { NumberInputComponent } from "../number-input/number-input.component";

@Component({
  selector: 'app-image-processor',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent, ButtonComponent, TranslatePipe, NumberInputComponent],
  templateUrl: './image-processor.component.html',
  styleUrls: ['./image-processor.component.scss']
})
export class ImageProcessorComponent implements OnChanges {
  // Inyectados automáticamente por tu ModalService al abrir el modal
  close?: (result?: any) => void;
  dismiss?: (reason?: any) => void;

  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  // Inputs asignados dinámicamente por tu ModalService
  @Input() imageBase64: string = '';
  @Input() originalFormat: 'png' | 'jpeg' | 'bmp' | 'webp' | 'ico' = 'webp';
  @Input({ transform: (v: number | null | undefined) => v ?? 1920 }) maxWidth = 0;
  @Input({ transform: (v: number | null | undefined) => v ?? 1080 }) maxHeight = 1080;
  @Input({ transform: (v: number | null | undefined) => v ?? 0.25 }) minAspectRatio = 0.25; // Alto 4, Ancho 1
  @Input({ transform: (v: number | null | undefined) => v ?? 4.0 }) maxAspectRatio = 4.0; // Alto 1, Ancho 4
  @Input() fixedAspectRatio?: number;
  @Input({ transform: (v: number | null | undefined) => v ?? 1024 }) maxFileSizeKB = 1024;

  private cdr = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);
  // Estado reactivo basado en Signals
  imageBase64Signal = signal<string>('');
  resultBase64 = signal<string>('');
  quality = signal<number>(80);
  cropCoords = signal<CropperPosition | null>(null);

  // Resize dimensions (max width/height for output, NOT aspect ratio)
  cropWidth = signal<number>(this.maxWidth);
  cropHeight = signal<number>(this.maxHeight);

  // Result image info
  resultImageSize = signal<{ width: number; height: number } | null>(null);
  resultFileSizeKB = signal<number>(0);
  isFileSizeValid = computed(() => this.resultFileSizeKB() <= this.maxFileSizeKB);

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
    if (!this.imageBase64Signal()) return true;
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
  ngOnInit() {
    this.imageBase64Signal.set(this.imageBase64 || '')
    this.cropWidth.set(this.maxWidth);
    this.cropHeight.set(this.maxHeight);
  }
  ngOnChanges() {
    // Sincronizamos las propiedades dinámicas inyectadas con nuestros signals de control
    this.imageBase64Signal.set(this.imageBase64 || '')
    // Reset crop dimensions to max values when inputs change
    this.cropWidth.set(this.maxWidth);
    this.cropHeight.set(this.maxHeight);
    // El truco de magia de tu ModalService para asegurar que la UI se entere de los cambios de inputs
    this.cdr.detectChanges();
  }

  removeImage() {
    this.imageBase64Signal.set('');
    this.cropCoords.set(null);
    this.resultImageSize.set(null);
    this.resultFileSizeKB.set(0);
    this.close?.('')
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
    this.resultBase64.set(event.base64!);

    // Calculate result image dimensions from the cropped event
    if (event.width && event.height) {
      this.resultImageSize.set({ width: event.width, height: event.height });
    }

    // Calculate file size from the result base64
    const base64Length = event.base64?.length || 0;
    const sizeKB = Math.round((base64Length * 3) / 4 / 1024);
    this.resultFileSizeKB.set(sizeKB);
  }

  saveImage() {
    if (!this.isFormValid()) return;

    if (!this.imageBase64Signal()) {
      this.close?.(null); // Retorna null indicando al input que borre el archivo
      return;
    }
    this.close?.(this.resultBase64())
  }
  onCancelClick(): void {
    this.close?.(undefined); // Retorna undefined para ignorar cualquier cambio
  }
}
