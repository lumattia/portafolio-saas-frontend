import { Component, inject, input, output, signal } from '@angular/core';
import { compressImage } from '../../../core/utils/image-compression';
import { MediaService } from '../../../core/services/media.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css',
})
export class ImageUploadComponent {
  private readonly mediaService = inject(MediaService);

  readonly label = input('Elegir imagen');
  readonly hint = input('Se optimiza automáticamente antes de subir.');
  readonly imageUrl = input('');

  readonly uploaded = output<string>();

  readonly previewUrl = signal<string | null>(null);
  readonly uploading = signal(false);
  readonly error = signal<string | null>(null);

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.error.set(null);
    this.uploading.set(true);

    try {
      const compressed = await compressImage(file);
      this.previewUrl.set(URL.createObjectURL(compressed));

      this.mediaService.uploadImage(compressed).subscribe({
        next: (res) => {
          this.uploading.set(false);
          this.uploaded.emit(res.url);
        },
        error: () => {
          this.uploading.set(false);
          this.error.set('No se pudo subir la imagen. Inténtalo de nuevo.');
        },
      });
    } catch {
      this.uploading.set(false);
      this.error.set('No se pudo preparar la imagen.');
    }
  }

  displayUrl(): string | null {
    return this.previewUrl() ?? (this.imageUrl() || null);
  }
}
