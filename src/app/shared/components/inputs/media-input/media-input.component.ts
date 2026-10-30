import { Component, inject, model, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Media } from '../../../../core/models/media.model';
import { ModalService } from '../../../../core/services/modal.service';
import { MediaSelectorComponent } from '../../../../features/admin/medias/selectors/media-selector/media-selector.component';
import { DimensionInputComponent } from '../../dimension-input/dimension-input.component';
import { BoxDimensions, DimensionValue } from '../../../../core/models/dimension.model';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-media-input',
  standalone: true,
  imports: [CommonModule, DimensionInputComponent, ButtonComponent],
  templateUrl: './media-input.component.html',
  styleUrls: ['./media-input.component.scss']
})
export class MediaInputComponent {
  private modalService = inject(ModalService);

  media = model<Media>();
  boxDimension = model.required<BoxDimensions>();

  maxWidth = input<number>();
  maxHeight = input<number>();
  minAspectRatio = input<number>();
  maxAspectRatio = input<number>();
  fixedAspectRatio = input<number>();
  readonly = input<boolean>(false);
  private formatDimension(dim?: DimensionValue | null): string {
    if (!dim || dim.unit === 'auto') return 'auto';
    return `${dim.value ?? 0}${dim.unit}`;
  }

  readonly previewStyles = computed(() => {
    const box = this.boxDimension();
    return {
      width: this.formatDimension(box?.width),
      height: this.formatDimension(box?.height)
    };
  });

  openMediaSelector(): void {
    if (this.readonly()) return;

    const modalRef = this.modalService.open(MediaSelectorComponent);
    modalRef.componentInstance.mediaType = 'Image';

    modalRef.result.then((selectedMedia: any) => {
      if (selectedMedia.data) {
        this.media.set(selectedMedia.data);
      }
    });
  }

  removeSelectedMedia(): void {
    if (this.readonly()) return;
    this.media.set(undefined);
  }
}
