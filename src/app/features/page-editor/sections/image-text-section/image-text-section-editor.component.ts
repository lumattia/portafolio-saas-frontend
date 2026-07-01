import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEditorService } from '../../../../core/services/page-editor.service';
import { RichTextInputComponent } from '../../../../shared/components/inputs/rich-text-input/rich-text-input.component';
import { createDefaultImageTextSectionContent, ImageTextSectionContent } from './image-text-section.model';
import { ImageInputComponent } from '../../../../shared/components/inputs/image-input/image-input.component';

@Component({
  selector: 'app-image-text-section-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageInputComponent, RichTextInputComponent],
  templateUrl: './image-text-section-editor.component.html',
  styleUrls: ['./image-text-section-editor.component.scss'],
})
export class ImageTextSectionEditorComponent {
  private readonly pageEditorService = inject(PageEditorService);
  readonly selectedSection = this.pageEditorService.selectedSection;
  readonly showStylePanel = signal(false);
  
  get content(): ImageTextSectionContent {
      return createDefaultImageTextSectionContent(this.selectedSection()!.contentJson);
  }
  
  toggleStylePanel(): void {
    this.showStylePanel.update(v => !v);
  }

onContentChange(key: string, value: any, type: 'inputs' | 'styles' = 'inputs'): void {
  const section = this.selectedSection();
  if (!section) return;

  // Evitamos nulos o undefined para mantener limpio el JSON
  const safeValue = (value === null || value === undefined) ? '' : value;

  // Clonamos el estado actual de inputs y styles
  const currentInputs = section.contentJson.inputs || {};
  const currentStyles = section.contentJson.styles || {};

  // Actualizamos dinámicamente el objeto correcto basándonos en el 'type'
  const updatedContent = {
    inputs: type === 'inputs' ? { ...currentInputs, [key]: safeValue } : currentInputs,
    styles: type === 'styles' ? { ...currentStyles, [key]: safeValue } : currentStyles
  };

  this.pageEditorService.updateSectionContent(updatedContent);
}
}