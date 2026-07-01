import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEditorService } from '../../../../core/services/page-editor.service';
import { createDefaultImageSectionContent, ImageSectionContent } from './image-section.model';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';

@Component({
  selector: 'app-image-section-editor',
  standalone: true,
  imports: [CommonModule, ImageInputComponent],
  templateUrl: './image-section-editor.component.html',
  styleUrls: ['./image-section-editor.component.scss'],
})
export class ImageSectionEditorComponent {
  private readonly pageEditorService = inject(PageEditorService);
  readonly selectedSection = this.pageEditorService.selectedSection;

  get content(): ImageSectionContent {
    return createDefaultImageSectionContent(this.selectedSection()!.contentJson);
  }

  onContentChange(value: string | null): void {
    const section = this.selectedSection();
    if (!section) return;
    const updatedContent = { 
      inputs: { image: value ?? '' },
      styles: section.contentJson.styles || {}
    };
    this.pageEditorService.updateSectionContent(updatedContent);
  }
}
